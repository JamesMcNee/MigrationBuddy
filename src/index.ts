#!/usr/bin/env node
import { Command } from "commander";
import { Logger } from "./logger";
import { ConfigProcessor } from "./config-processor";
import { Configuration, EndpointConfiguration } from "./model/configuration/configuration.model";
import { ServiceComparator } from "./service-comparator";
import { EndpointResult } from "./model/endpoint-result.model";
import { HTMLReportGenerator } from "./html-report-generator";

const clear = require("clear");
const packageJson = require("./package.json");
const exampleConfig = require("./resources/mibration-buddy-config.json");
const fs = require("fs");
const cliProgress = require("cli-progress");
const clipboardy = require("clipboardy");

const program = new Command();

clear();
Logger.banner("Migration Buddy");
Logger.logColour("white", `Version: ${packageJson.version}, Description: ${packageJson.description}`);
Logger.linebreak();

program
  .name("compare")
  .version(packageJson.version)
  .command("compare <config-file>", { isDefault: true })
  .description("Run endpoint comparison using the supplied comparison")
  .option("-ohf, --output-html-file <path>", "Path to create output HTML file")
  .option("-ojf, --output-json-file <path>", "Path to create output JSON file")
  .option("-oc, --output-to-clipboard", "Output results to clipboard")
  .option("-v, --verbose", "Enable verbose logging / responses")
  .action(async (configFilePath, options) => {
    const configValidator = new ConfigProcessor(readConfigFile(configFilePath, options.verbose));

    const compiledConfig: {
      data?: Configuration | undefined;
      errors?: any;
    } = configValidator.compile();

    if (!compiledConfig.data) {
      let message: string = `Configuration failed schema validation!`;

      if (options.verbose) {
        Logger.error(message, compiledConfig.errors);
      } else {
        Logger.error(message);
      }
      process.exit(-1);
    }

    const serviceComparator: ServiceComparator = new ServiceComparator(compiledConfig.data);

    const resultMapWithConfig: { [key: string]: { result: EndpointResult; config: EndpointConfiguration } } = {};

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const endpoints: { [key: string]: EndpointConfiguration } = compiledConfig.data.endpoints;
    const endpointKeys: string[] = Object.keys(endpoints);
    progressBar.start(endpointKeys.length, 0);

    for (let i = 0; i < endpointKeys.length; i++) {
      const endpointPath: string = endpointKeys[i];
      const endpointConfig: EndpointConfiguration = endpoints[endpointPath];

      resultMapWithConfig[endpointPath] = {
        result: await serviceComparator.compare(endpointPath, endpointConfig),
        config: endpointConfig,
      };
      progressBar.increment();
    }

    progressBar.stop();

    const results = Object.entries(resultMapWithConfig)
      .map(([key, value]: [string, { result: EndpointResult; config: EndpointConfiguration }]) => {
        return { key: key, value: value.result };
      })
      .reduce((prev: { [key: string]: EndpointResult }, next) => {
        prev[next.key] = next.value;
        return prev;
      }, {});

    if (!!options.outputToClipboard || !!options.outputJsonFile || !!options.outputHtmlFile) {
      if (!!options.outputToClipboard) {
        clipboardy.writeSync(JSON.stringify(results, null, 2));
        Logger.info(`Results copied to clipboard`);
      }

      if (!!options.outputJsonFile) {
        let outputFile = options.outputJsonFile;
        if (!outputFile) {
          Logger.error("Destination not provided!");
          return;
        }

        if (!outputFile.endsWith(".json")) {
          outputFile = `${outputFile}.json`;
        }

        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
        Logger.info(`Results written to file: ${outputFile}`);
      }

      if (!!options.outputHtmlFile) {
        let outputFile = options.outputHtmlFile;
        if (!outputFile) {
          Logger.error("Destination not provided!");
          return;
        }

        if (!outputFile.endsWith(".html")) {
          outputFile = `${outputFile}.html`;
        }

        const htmlReportGenerator: HTMLReportGenerator = new HTMLReportGenerator(resultMapWithConfig, compiledConfig.data);
        htmlReportGenerator.createReport(outputFile);
        Logger.info(`Results written to file: ${outputFile}`);
      }
    } else {
      Logger.linebreak();
      Logger.log("Results:");
      Logger.log(results as any);
    }
  });

program
  .command("generate <destination>")
  .description("Generate example configuration file to use as template")
  .action((destination) => {
    if (!destination || !destination.endsWith(".json")) {
      Logger.error("Destination not valid, must be a valid file path ending in '.json'.");
      return;
    }
    fs.writeFileSync(destination, JSON.stringify(exampleConfig, null, 2));
    Logger.info(`Created configuration file: ${destination}`);
  });

if (process.argv.length == 2) {
  program.outputHelp();
}

program.parse(process.argv);

function readConfigFile(path: string, verboseLogging: boolean = false): JSON {
  try {
    return JSON.parse(fs.readFileSync(path));
  } catch (e) {
    let message: string = `Error reading config file. Ensure file exists and is valid JSON.`;

    if (verboseLogging) {
      Logger.errorWithStack(message, <Error>e);
    } else {
      Logger.error(message);
    }
    process.exit(-1);
  }
}
