import { EndpointResult } from "./model/endpoint-result.model";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Configuration, EndpointConfiguration } from "./model/configuration/configuration.model";
import { DiffUtils } from "./diff-utils";

export class HTMLReportGenerator {
  private readonly _template: string;
  private readonly _results: { [key: string]: { result: EndpointResult; config: EndpointConfiguration } };

  constructor(results: { [key: string]: { result: EndpointResult; config: EndpointConfiguration } }, config: Configuration) {
    const themeFiles: string[] =
      config.configuration.global.options?.htmlReport?.theme === "dark"
        ? ["css/bootstrap/bootstrap.dark.min.css", "css/overrides.dark.css"]
        : ["css/bootstrap/bootstrap.flat.min.css"];

    this._template = this.readFilesAndCombine(
      "top.html",
      ...themeFiles,
      "css/html.css",
      "css/annotated.css",
      "css/html-report.css",
      "close-style-head.html",
      "html-report.html",
      "bottom.html"
    );
    this._results = results;
  }

  public createReport(path: string): void {
    const template = Handlebars.compile(this._template);
    const result = template(this.transformReport(this._results));

    fs.writeFileSync(path, result);
  }

  private transformReport(data: { [key: string]: { result: EndpointResult; config: EndpointConfiguration } }): { results: any[] } {
    return {
      results: Object.entries(data).map(([key, value]: [string, { result: EndpointResult; config: EndpointConfiguration }], index: number) => {
        const controlBodyDiffSettingsApplied = JSON.stringify(DiffUtils.format(value.result.responseBody.control, value.config.options));
        const candidateBodyDiffSettingsApplied = JSON.stringify(DiffUtils.format(value.result.responseBody.candidate, value.config.options));

        return {
          id: index,
          path: key,
          ...value.result,
          responseTime: {
            ...value.result.responseTime,
            increase: value.result.responseTime.control < value.result.responseTime.candidate,
          },
          diff: {
            control: controlBodyDiffSettingsApplied,
            candidate: candidateBodyDiffSettingsApplied,
            match: controlBodyDiffSettingsApplied === candidateBodyDiffSettingsApplied,
          },
        };
      }),
    };
  }

  private readFilesAndCombine(...paths: string[]): string {
    return paths.reduce((prev: string, next: string) => {
      const data: string = fs.readFileSync(path.resolve(__dirname, "./resources/html-report/", next), "utf-8");

      return `${prev}${data}`;
    }, "");
  }
}
