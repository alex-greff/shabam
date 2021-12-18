import { AuthenticatedCommand } from "../../base/AuthenticatedCommand";
import { GetF } from "../../utilities";

interface Args {
  file: string;
}

export default class Search extends AuthenticatedCommand {
  static description = "Search for a track in the Shabam database.";

  static args = [
    {
      name: "file",
      description: "File path to audio clip that will be searched.",
      required: true,
    },
  ];

  static flags = {
    ...AuthenticatedCommand.flags,
  };

  static examples = [`$ shabam search path/to/audio-clip`];

  async run(): Promise<void> {
    await super.run();

    const { args, flags } = await this.parse<GetF<typeof Search>, Args>(Search);

    this.log("TODO: implement search");
  }
}
