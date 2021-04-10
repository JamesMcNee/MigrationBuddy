import chalk = require('chalk');
const figlet = require('figlet');

export class Logger {

    static linebreak() {
        this.log("");
    };

    static banner(message: string) {
        this.log(figlet.textSync(message, {font: 'small', horizontalLayout: 'full'}), 'blueBright')
    }

    static log(message: string, color: 'white' | 'blueBright' = 'white'): void {
        console.log(chalk`{${color} ${message}}`);
    }

}