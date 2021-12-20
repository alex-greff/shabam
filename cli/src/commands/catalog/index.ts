import { Command } from "@oclif/core";
import color from "@oclif/color";

export default class Catalog extends Command {
  static description = "Read/update the Shabam track catalog.";

  async run(): Promise<void> {
    this.error(`Please use one of the ${color.blueBright("sub-commands")}.`);
  }
}
