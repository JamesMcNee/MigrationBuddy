import chalk = require("chalk");
const figlet = require("figlet");

export class Logger {
  static linebreak() {
    this.log("");
  }

  static banner(message: string) {
    this.logColour(
      "blueBright",
      figlet.textSync(message, { font: "small", horizontalLayout: "full" })
    );
  }

  static info(...message: string[]): void {
    this.logColour("blue", `INFO: ${message[0]}`, ...message.slice(1));
  }

  static error(...message: string[]): void {
    this.logColour("red", `ERROR: ${message[0]}`, ...message.slice(1));
  }

  static errorWithStack(message: string, e: Error) {
    console.log(chalk`{red ${message}}`);
    console.log(e);
  }

  static log(...message: string[]): void {
    this.logColour("whiteBright", ...message);
  }

  static logColour(
    color:
      | "white"
      | "whiteBright"
      | "blue"
      | "blueBright"
      | "red"
      | "redBright" = "white",
    ...message: string[]
  ): void {
    const string = message.reduce((prev, current) => {
      const currentString =
        typeof current === "object"
          ? JSON.stringify(current, null, 2)
          : current;
      return `${prev}${!!prev ? "\n" : ""}${currentString}`;
    }, "");

    console.log(chalk`{${color} ${string}}`);
  }
}
