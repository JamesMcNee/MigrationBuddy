import Ajv, { ValidateFunction } from "ajv";
import {
  Configuration,
  EndpointConfiguration,
  EndpointConfigurationOptions,
} from "./model/configuration/configuration.model";
import { ConfigurationSchema } from "./model/configuration/configuration.schema";

export class ConfigProcessor {
  //Test
  private readonly _validatorFunction: ValidateFunction<Configuration>;
  private readonly _json: JSON;

  constructor(json: JSON) {
    const ajv: Ajv = new Ajv();

    this._validatorFunction = ajv.compile(ConfigurationSchema.schema);
    this._json = json;
  }

  public validate(): boolean {
    return this._validatorFunction(this._json);
  }

  public compile(): { data?: Configuration | undefined; errors?: any } {
    if (this.validate()) {
      return {
        data: this.mergeLocalAndGlobal(this._json as any),
        errors: undefined,
      };
    }

    return {
      data: undefined,
      errors: this._validatorFunction.errors,
    };
  }

  private mergeLocalAndGlobal(configuration: Configuration): Configuration {
    const mergedEndpoints: {
      [key: string]: EndpointConfiguration;
    } = Object.entries(configuration.endpoints)
      .map(([path, endpointConfig]: [string, EndpointConfiguration]) => {
        const diffIgnoreKeysLength: string[] =
          endpointConfig?.options?.diff?.ignoreKeys;

        return {
          key: path,
          value: {
            ...endpointConfig,
            substitutions: {
              ...(configuration.configuration?.global?.substitutions || {}),
              ...(endpointConfig.substitutions || {}),
            },
            headers: {
              ...(configuration.configuration?.global?.headers || {}),
              ...(endpointConfig.headers || {}),
            },
            options: {
              diff: {
                sortArrays:
                  endpointConfig?.options?.diff?.sortArrays === undefined
                    ? configuration.configuration?.global?.options?.diff
                        ?.sortArrays
                    : endpointConfig.options.diff.sortArrays,
                ignoreKeys:
                  diffIgnoreKeysLength?.length > 0
                    ? ConfigProcessor.distinctArray([
                        ...(configuration.configuration?.global?.options?.diff
                          ?.ignoreKeys || []),
                        ...(endpointConfig?.options?.diff?.ignoreKeys || []),
                      ])
                    : [],
              },
            },
          },
        };
      })
      .reduce((prev: { [key: string]: EndpointConfiguration }, next) => {
        prev[next.key] = next.value;
        return prev;
      }, {});

    return {
      ...configuration,
      endpoints: mergedEndpoints,
    };
  }

  private static distinctArray<T>(array: T[]): T[] {
    return array.filter((n: T, i: number) => array.indexOf(n) === i);
  }
}
