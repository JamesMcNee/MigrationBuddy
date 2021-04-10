#!/usr/bin/env node
import {Command} from 'commander';
import {Logger} from "./logger";
import {ConfigValidator} from "./config-validator";
import {Configuration} from "./model/configuration/configuration.model";

const clear = require('clear');
const packageJson = require('../package.json');
const exampleConfig = require('./resources/mibration-buddy-config.json');
const fs = require('fs');

const program = new Command();

clear();
Logger.banner('Migration Buddy');
Logger.log(`Version: ${packageJson.version}, Description: ${packageJson.description}`);
Logger.linebreak()

program
    .name('migbuddy')
    .version(packageJson.version)
    .option('-c, --config <path>', 'Path to configuration file', 'migration-buddy-config.json')
    .option('-of, --output-file <path>', 'Path to create output file', './migration-buddy-results.json')
    .option('-oc, --output-to-clipboard', 'Output results to clipboard')
    .option('-v, --verbose', 'Enable verbose logging / responses');

const options = program.opts();

const configValidator = new ConfigValidator(exampleConfig);

const compiledConfig: { data: Configuration | undefined, errors?: any } = configValidator.compile();

if (!compiledConfig.data) {
    let message: string = `Configuration failed schema validation!`;
    if (options.verbose) {
        Logger.error(message, compiledConfig.errors);
    } else {
        Logger.error(message);
    }
}

program
    .command('generate <destination>')
    .description("Generate example configuration file to use as template")
    .action((destination) => {
        if (!destination || !destination.endsWith(".json")) {
            Logger.error("Destination not valid, must be a valid file path ending in '.json'.");
            return;
        }
        fs.writeFileSync(destination, JSON.stringify(exampleConfig, null, 2));
        Logger.info(`Created configuration file: ${destination}`);
    });

program
    .parse(process.argv);
