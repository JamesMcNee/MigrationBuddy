#!/usr/bin/env node
import {Command} from 'commander';
import {Logger} from "./logger";
import {ConfigValidator} from "./config-validator";
import {Configuration} from "./model/configuration/configuration.model";

const clear = require('clear');
const packageJson = require('../package.json');
const exampleConfig = require('./resources/mibration-buddy-config.json');

const program = new Command();

clear();
Logger.banner('Migration Buddy');
Logger.log(`Version: ${packageJson.version}, Description: ${packageJson.description}`);
Logger.linebreak()

program
    .name("migbuddy")
    .version(packageJson.version)
    .option('-c, --config <path>', 'Path to configuration file', 'migration-buddy-config.json')
    .option('-gc, --generate-config <path>', 'Path to generate a configuration file template', 'migration-buddy-config.json')
    .option('-of, --output-file <path>', 'Path to create output file', './migration-buddy-results.json')
    .option('-oc, --output-to-clipboard', 'Output results to clipboard')
    .option('-v, --verbose', 'Enable verbose logging / responses')
    .parse(process.argv);

const options = program.opts();

const configValidator = new ConfigValidator(exampleConfig);

const compiledConfig: {data: Configuration | undefined, errors?: any } = configValidator.compile();

if (!compiledConfig.data) {
    let message: string = `Configuration failed schema validation!`;
    if (options.verbose) {
        Logger.error(message, compiledConfig.errors);
    } else {
        Logger.error(message);
    }
}


