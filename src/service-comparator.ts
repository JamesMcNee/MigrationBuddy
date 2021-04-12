import {
    Configuration,
    EndpointConfiguration,
    EndpointConfigurationOptions
} from "./model/configuration/configuration.model";
import {HttpClient} from "./http-client";
import {AxiosHttpClient} from "./axios-http-client";
import {diff} from 'json-diff';
import {EndpointResult} from "./model/endpoint-result.model";

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
                ...endpointConfig.substitutions || {}
            };

            let substitutedPath = input;
            Object.keys(substitutions).forEach(key => {
                substitutedPath = substitutedPath.replace(`{${key}}`, substitutions[key] as string);
            });
            return substitutedPath;
        }

        const controlResult = await this._httpClient.get(
            `${this._configuration.configuration.control.url}${substitute(path)}`,
            {
                ...this._configuration.configuration.control.headers || {},
                ...endpointConfig.headers || {}
            });
        const candidateResult = await this._httpClient.get(
            `${this._configuration.configuration.candidate.url}${substitute(endpointConfig.candidatePath || path)}`,
            {
                ...this._configuration.configuration.candidate.headers || {},
                ...endpointConfig.headers || {}
            });

        const difference = diff(
            ServiceComparator.DiffUtils.format(controlResult.body, endpointConfig.options),
            ServiceComparator.DiffUtils.format(candidateResult.body, endpointConfig.options)
        );

        return Promise.resolve({
            status: {
                pretty: `Control: ${controlResult.status} -> Candidate: ${candidateResult.status}`,
                control: controlResult.status,
                candidate: candidateResult.status,
            },
            responseTime: {
                pretty: ServiceComparator.createResponseTimeString(controlResult.responseTime, candidateResult.responseTime),
                control: controlResult.responseTime,
                candidate: candidateResult.responseTime,
                metadata: {
                    'unit': 'milliseconds'
                }
            },
            diff: difference
        });
    }

    private static createResponseTimeString(leftMillis: number, rightMillis: number): string {
        const percentage = Math.round((leftMillis / rightMillis) * 100);

        let percentageString = ''
        if (percentage > 100) {
            percentageString = `${percentage - 100}% faster`;
        } else if (percentage === 100) {
            percentageString = `response times identical`;
        } else {
            percentageString = `${100 - percentage}% slower`;
        }

        return `Control: ${leftMillis}ms -> Candidate: ${rightMillis}ms (${percentageString})`;
    }

    private static DiffUtils = class {
        public static format(obj: any, options: EndpointConfigurationOptions): any {
            let altered = {...obj};

            altered = this.removeKeysRecursively(altered, options?.diff?.ignoreKeys || []);
            if (options?.diff?.sortArrays) {
                altered = this.sortArraysRecursively(altered);
            }

            return altered;
        }

        private static sortArraysRecursively(obj: any) {
            if (!obj) {
                return obj;
            }

            if (obj instanceof Array) {
                obj.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
                obj.forEach((item) => this.sortArraysRecursively(item));
            } else if (typeof obj === 'object') {
                Object.getOwnPropertyNames(obj).forEach((key) => this.sortArraysRecursively(obj[key]));
            }

            return obj;
        }

        private static removeKeysRecursively(obj: any, keys: string[]) {
            if (!obj) {
                return obj;
            }

            if (obj instanceof Array) {
                obj.forEach((item) => this.removeKeysRecursively(item, keys));
            } else if (typeof obj === 'object') {
                Object.getOwnPropertyNames(obj).forEach((key) => {
                    if (keys.indexOf(key) !== -1) delete obj[key];
                    else this.removeKeysRecursively(obj[key], keys);
                });
            }

            return obj;
        }
    }
}
