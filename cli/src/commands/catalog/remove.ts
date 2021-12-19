import { Command } from "@oclif/core";
import { AuthenticatedCommand } from "../../base/AuthenticatedCommand";
import { GetF } from "../../types";

interface Args {
  id: string;
}

export default class CatalogRemove extends AuthenticatedCommand {
  static description = "Remove a track from the catalog.";

  static args = [
    {
      name: "id",
      description: "The ID of the track.",
      required: true,
    },
  ];

  static flags = {
    ...AuthenticatedCommand.flags,
  };

  static examples = [`$ shabam search path/to/audio-clip`];

  async run(): Promise<void> {
    await super.run();

    const { args, flags } = await this.parse<GetF<typeof CatalogRemove>, Args>(
      CatalogRemove
    );

    this.log("TODO: implement catalog remove");
  }
}
