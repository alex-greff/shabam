import { Command } from "@oclif/core";
import { GetF } from "../../utilities";

interface Args {
  file: string;
}

export default class Search extends Command {
  static description = "Search for a track in the Shabam database.";

  static args = [
    {
      name: "file",
      description: "File path to audio clip that will be searched.",
      required: true,
    },
  ];

  static examples = [
    `$ shabam search path/to/audio-clip`
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse<GetF<typeof Search>, Args>(Search);

    this.log("TODO: implement search");
  }
}
