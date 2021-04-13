import { JSONSchemaType } from "ajv";
import {
  Configuration,
  EndpointConfiguration,
  EndpointConfigurationOptions,
  GlobalConfiguration,
  ServiceConfiguration,
} from "./configuration.model";

export class ConfigurationSchema {
  private static _substitutionsSchema: JSONSchemaType<{
    [key: string]: string | number;
  }> = {
    type: "object",
    required: [],
    patternProperties: {
      ".{1,}": {
        oneOf: [
          { type: "string", nullable: false },
          { type: "number", nullable: false },
        ],
      },
    },
  };

  private static _endpointOptionsSchema: JSONSchemaType<EndpointConfigurationOptions> = {
    type: "object",
    required: [],
    properties: {
      diff: {
        type: "object",
        required: [],
        properties: {
          sortArrays: {
            type: "boolean",
          },
          ignoreKeys: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },
  };

  private static _endpointSchema: JSONSchemaType<EndpointConfiguration> = {
    type: "object",
    required: [],
    properties: {
      candidatePath: {
        type: "string",
        nullable: true,
      },
      substitutions: ConfigurationSchema._substitutionsSchema,
      headers: {
        type: "object",
        required: [],
        nullable: true,
        patternProperties: {
          ".{1,}": { type: "string", nullable: false },
        },
      },
      options: ConfigurationSchema._endpointOptionsSchema,
    },
  };

  private static _serviceConfigurationSchema: JSONSchemaType<ServiceConfiguration> = {
    type: "object",
    required: ["url"],
    properties: {
      url: { type: "string", nullable: false },
      headers: {
        type: "object",
        required: [],
        nullable: true,
        patternProperties: {
          ".{1,}": { type: "string", nullable: false },
        },
      },
    },
  };

  private static _globalConfigurationSchema: JSONSchemaType<GlobalConfiguration> = {
    type: "object",
    required: [],
    properties: {
      substitutions: ConfigurationSchema._substitutionsSchema,
      headers: {
        type: "object",
        required: [],
        nullable: true,
        patternProperties: {
          ".{1,}": { type: "string", nullable: false },
        },
      },
      options: ConfigurationSchema._endpointOptionsSchema,
    },
  };

  private static _schema: JSONSchemaType<Configuration> = {
    type: "object",
    required: ["endpoints", "configuration"],
    properties: {
      endpoints: {
        type: "object",
        minProperties: 1,
        required: [],
        patternProperties: {
          ".{1,}": ConfigurationSchema._endpointSchema,
        },
      },
      configuration: {
        type: "object",
        required: ["control", "candidate"],
        properties: {
          global: ConfigurationSchema._globalConfigurationSchema,
          control: ConfigurationSchema._serviceConfigurationSchema,
          candidate: ConfigurationSchema._serviceConfigurationSchema,
        },
      },
    },
  };

  static get schema(): JSONSchemaType<Configuration> {
    return this._schema;
  }
}
