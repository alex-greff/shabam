import { Command } from "@oclif/core";
import { GetF } from "../../types";

interface Args {
  file: string;
}

export default class Catalog extends Command {
  static description = "Read/update the Shabam track catalog.";


  async run(): Promise<void> {
    const { args, flags } = await this.parse<GetF<typeof Catalog>, Args>(Catalog);

    this.log("TODO: implement search");
    // TODO: this should be a dummy command?
  }
}
