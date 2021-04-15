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

    const controlResult = await this._httpClient.get(`${this._configuration.configuration.control.url}${substitute(path)}`, {
      ...(this._configuration.configuration.control.headers || {}),
      ...(endpointConfig.headers || {}),
    });
    const candidateResult = await this._httpClient.get(
      `${this._configuration.configuration.candidate.url}${substitute(endpointConfig.candidatePath || path)}`,
      {
        ...(this._configuration.configuration.candidate.headers || {}),
        ...(endpointConfig.headers || {}),
      }
    );

    return Promise.resolve({
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
        control: controlResult.body,
        candidate: candidateResult.body,
        match: JSON.stringify(controlResult.body) === JSON.stringify(candidateResult.body),
      },
    });
  }

  private static createResponseTimeString(leftMillis: number, rightMillis: number): string {
    const percentage = Math.round((leftMillis / rightMillis) * 100);

    let percentageString = "";
    if (percentage > 100) {
      percentageString = `${percentage - 100}% faster`;
    } else if (percentage === 100) {
      percentageString = `response times identical`;
    } else {
      percentageString = `${100 - percentage}% slower`;
    }

    return `Control: ${leftMillis}ms -> Candidate: ${rightMillis}ms (${percentageString})`;
  }

  private static isErrorStatus(status: number): boolean {
    return status >= 400;
  }
}
