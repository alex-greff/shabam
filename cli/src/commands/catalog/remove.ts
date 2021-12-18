import { Command } from "@oclif/core";
import { GetF } from "../../utilities";

interface Args {
  id: string;
}

export default class CatalogRemove extends Command {
  static description = "Remove a track from the catalog.";

  static args = [
    {
      name: "id",
      description: "The ID of the track.",
      required: true,
    },
  ];

  static examples = [`$ shabam search path/to/audio-clip`];

  async run(): Promise<void> {
    const { args, flags } = await this.parse<GetF<typeof CatalogRemove>, Args>(
      CatalogRemove
    );

    this.log("TODO: implement catalog remove");
  }
}
