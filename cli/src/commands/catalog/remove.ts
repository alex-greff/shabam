import { AuthenticatedCommand } from "../../base/AuthenticatedCommand";
import { GetF } from "../../types";
import * as Utilities from "../../utilities";
import { ClientError } from "graphql-request";

interface Args {
  id: string;
}

export default class CatalogRemove extends AuthenticatedCommand {
  static description = "Remove a track from the catalog.";

  static args = [
    ...(AuthenticatedCommand.args ?? []),
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

    const { args } = await this.parse<GetF<typeof CatalogRemove>, Args>(
      CatalogRemove
    );

    const { id: idStr } = args;

    let id: number;
    try {
      id = parseInt(idStr);
    } catch (err) {
      this.error("Id is not a number");
    }

    try {
      await this.sdkClient.RemoveTrack({
        id,
      });
    } catch (err) {
      this.error(
        Utilities.prettyPrintErrors(
          err as ClientError,
          "Unable to remove track"
        )
      );
    }

    this.log("Successfully removed track!");
  }
}
