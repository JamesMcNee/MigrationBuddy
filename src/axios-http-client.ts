import { HttpClient } from "./http-client";

const axios = require("axios").default;

export class AxiosHttpClient implements HttpClient {
  constructor() {
    axios.interceptors.request.use((x: any) => {
      x.meta = x.meta || {};
      x.meta.requestStartedAt = new Date().getTime();
      return x;
    });

    axios.interceptors.response.use(
      (x: any) => {
        x.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
        return x;
      },
      (x: any) => {
        x.response.responseTime = new Date().getTime() - x.config.meta.requestStartedAt;
        throw x;
      }
    );
  }

  public async get(
    url: string,
    headers: { [key: string]: string } | undefined
  ): Promise<{ status: number; response: { body: { value: any; isJson: boolean } }; responseTime: number }> {
    return axios
      .get(url, {
        headers: headers,
      })
      .then((response: { status: number; data: any; responseTime: number }) => {
        return {
          status: response.status,
          response: {
            body: {
              value: response.data,
              isJson: AxiosHttpClient.isJson(response.data),
            },
          },
          responseTime: response.responseTime,
        };
      })
      .catch((error: { response: { status: number; data: any; responseTime: number } }) => {
        const status = error.response.status;

        return {
          status: status,
          response: {
            body: {
              value: error.response.data,
              isJson: AxiosHttpClient.isJson(error.response.data),
            },
          },
          responseTime: error.response.responseTime,
        };
      });
  }

  private static isJson(object: any): boolean {
    try {
      if (typeof object === "string") {
        JSON.parse(object);
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}
