import {HttpClient} from "./http-client";

const axios = require('axios').default;

export class AxiosHttpClient implements HttpClient {

    constructor() {
        axios.interceptors.request.use((x: any) => {
            x.meta = x.meta || {}
            x.meta.requestStartedAt = new Date().getTime();
            return x;
        });

        axios.interceptors.response.use((x: any) => {
            x.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
            return x;
        }, (x: any) => {
            x.response.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
            throw x;
        });
    }

    public async get(url: string, headers: { [key: string]: string } | undefined): Promise<{ status: number, body: any, responseTime: number }> {
        return axios.get(url, {
            headers: headers
        }).then((response: { status: number, data: any, responseTime: number }) => {
            return {status: response.status, body: response.data, responseTime: response.responseTime};
        }).catch((error: { response: { status: number, data: any, responseTime: number } }) => {
            const status = error.response.status;

            if (status >= 400 && status < 500) {
                return {status: status, body: error.response.data, responseTime: error.response.responseTime};
            }

            return {status: status, body: undefined, responseTime: error.response.responseTime};
        });
    }

}
