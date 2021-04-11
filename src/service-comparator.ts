import {Configuration, EndpointConfiguration} from "./model/configuration/configuration.model";
import {HttpClient} from "./http-client";
import {AxiosHttpClient} from "./axios-http-client";
import {diff} from 'json-diff';

export class ServiceComparator {

    private _configuration: Configuration;
    private _httpClient: HttpClient;

    constructor(configuration: Configuration) {
        this._configuration = configuration;
        this._httpClient = new AxiosHttpClient();
    }

    public async compare(path: string, endpointConfig: EndpointConfiguration): Promise<{ statusMatch: boolean, status: string, diff: any }> {
        const substitute = (input: string): string => {
            let substitutedPath = input;
            Object.keys(endpointConfig.substitutions || {}).forEach(key => {
                substitutedPath = substitutedPath.replace(`{${key}}`, endpointConfig.substitutions[key] as string);
            });
            return substitutedPath;
        }

        const controlResult = await this._httpClient.get(`${this._configuration.configuration.control.url}${substitute(path)}`, this._configuration.configuration.control.headers);
        const candidateResult = await this._httpClient.get(`${this._configuration.configuration.candidate.url}${substitute(endpointConfig.candidatePath || path)}`, this._configuration.configuration.candidate.headers);

        const difference = diff(this.format(controlResult.body), this.format(candidateResult.body));

        return Promise.resolve({
            statusMatch: controlResult.status === candidateResult.status,
            status: `${controlResult.status} -> ${candidateResult.status}`,
            responseTime: this.createResponseTimeString(controlResult.responseTime, candidateResult.responseTime),
            diff: difference
        });
    }

    private createResponseTimeString(leftMillis: number, rightMillis: number): string {
        const percentage = Math.round((leftMillis / rightMillis) * 100);

        let percentageString = ''
        if (percentage > 100) {
            percentageString = `${percentage - 100}% faster`;
        } else if (percentage === 100) {
            percentageString = `response times identical`;
        } else {
            percentageString = `${100 - percentage}% slower`;
        }

        return `${leftMillis}ms -> ${rightMillis}ms (${percentageString})`;
    }


    private format(obj: any): any {
        let altered = {...obj};

        altered = this.removeKeysRecursively(altered, ["_links"]);
        altered = this.sortArraysRecursively(altered);

        return altered;
    }

    private sortArraysRecursively(obj: any) {
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

    private removeKeysRecursively(obj: any, keys: string[]) {
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