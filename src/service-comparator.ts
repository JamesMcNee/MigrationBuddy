import { Configuration, EndpointConfiguration } from "./model/configuration/configuration.model";
import { HttpClient } from "./http-client";
import { AxiosHttpClient } from "./axios-http-client";
import { EndpointResult } from "./model/endpoint-result.model";

export class ServiceComparator {
  private _configuration: Configuration;
  private _httpClient: HttpClient;

  constructor(configuration: Configuration) {
    this._configuration = configuration;
    this._httpClient = new AxiosHttpClient();
  }

  public async compare(path: string, endpointConfig: EndpointConfiguration): Promise<EndpointResult> {
    const substitute = (input: string): string => {
      const substitutions = {
        ...(endpointConfig.substitutions || {}),
      };

      let substitutedPath = input;
      Object.keys(substitutions).forEach((key) => {
        substitutedPath = substitutedPath.replace(`{${key}}`, substitutions[key] as string);
      });
      return substitutedPath;
    };

    const controlPath: string = substitute(path);
    const candidatePath: string = substitute(endpointConfig.candidatePath || path);

    const controlResult = await this._httpClient.get(`${this._configuration.configuration.control.url}${controlPath}`, {
      ...(this._configuration.configuration.control.headers || {}),
      ...(endpointConfig.headers || {}),
    });
    const candidateResult = await this._httpClient.get(`${this._configuration.configuration.candidate.url}${candidatePath}`, {
      ...(this._configuration.configuration.candidate.headers || {}),
      ...(endpointConfig.headers || {}),
    });

    return Promise.resolve({
      actualPath: {
        pretty: controlPath === candidatePath ? `'${controlPath}'` : `Control: '${controlPath}'   |   Candidate: '${candidatePath}'`,
        control: controlPath,
        candidate: candidatePath,
        match: controlPath === candidatePath,
      },
      status: {
        pretty: `Control: ${controlResult.status} -> Candidate: ${candidateResult.status}`,
        control: controlResult.status,
        candidate: candidateResult.status,
        match: controlResult.status === candidateResult.status,
        metadata: {
          eitherPathErrored: ServiceComparator.isErrorStatus(controlResult.status) || ServiceComparator.isErrorStatus(candidateResult.status),
        },
      },
      responseTime: {
        pretty: ServiceComparator.createResponseTimeString(controlResult.responseTime, candidateResult.responseTime),
        control: controlResult.responseTime,
        candidate: candidateResult.responseTime,
        match: controlResult.responseTime === candidateResult.responseTime,
        metadata: {
          unit: "milliseconds",
          percentage: {
            value: Math.abs(Math.round((controlResult.responseTime / candidateResult.responseTime) * 100) - 100),
          },
        },
      },
      responseBody: {
        control: controlResult.response.body.value,
        candidate: candidateResult.response.body.value,
        match: ServiceComparator.isMatch(
          controlResult.response.body.value,
          candidateResult.response.body.value,
          controlResult.response.body.isJson && candidateResult.response.body.isJson
        ),
        metadata: {
          isJson: controlResult.response.body.isJson && candidateResult.response.body.isJson,
        },
      },
    });
  }

  private static createResponseTimeString(leftMillis: number, rightMillis: number): string {
    return `Control: ${leftMillis}ms -> Candidate: ${rightMillis}ms`;
  }

  private static isErrorStatus(status: number): boolean {
    return status >= 400;
  }

  private static isMatch(left: any, right: any, isJson: boolean): boolean {
    if (isJson) {
      return JSON.stringify(left) === JSON.stringify(right);
    }

    return left === right;
  }
}
