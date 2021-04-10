import chalk = require('chalk');
const figlet = require('figlet');

export class Logger {

    static linebreak() {
        this.log("");
    };

    static banner(message: string) {
        this.logColour('blueBright', figlet.textSync(message, {font: 'small', horizontalLayout: 'full'}));
    }

    static error(...message: string[]) {
        this.logColour('red', `ERROR: ${message[0]}`, ...message.slice(1));
    }

    static log(...message: string[]): void {
        this.logColour('white', ...message);
    }

    static logColour(color: 'white' | 'blue' | 'blueBright' | 'red' | 'redBright' = 'white', ...message: string[]): void {
        const string = message.reduce((prev, current) => {
            const currentString = typeof current === 'object' ? JSON.stringify(current, null, 2) : current;
            return `${prev}${!!prev ? '\n' : ''}${currentString}`;
        }, '');

        console.log(chalk`{${color} ${string}}`);
    }

}