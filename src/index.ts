#!/usr/bin/env node
import {Command} from 'commander';
import {Logger} from "./logger";

const clear = require('clear');
const packageJson = require('../package.json');

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
    .parse(process.argv);
// program.outputHelp();

const options = program.opts();


