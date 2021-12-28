import { Flags } from "@oclif/core";
import { AuthenticatedCommand } from "../../base/AuthenticatedCommand";
import { GetF } from "../../types";
import * as Utilities from "../../utilities";
import { ClientError } from "graphql-request";
import { GetTracksQuery } from "../../graphql-request.g";
import color from "@oclif/color";

interface Args {}

export default class CatalogList extends AuthenticatedCommand {
  static description = "List the tracks in the Shabam catalog.";

  static args = [...(AuthenticatedCommand.args ?? [])];

  static flags = {
    ...AuthenticatedCommand.flags,
    uploader: Flags.string({
      char: "u",
      description: "The uploader of the track.",
      required: false,
    }),
    page: Flags.integer({
      char: "p",
      description: "The result page number to give.",
      default: 0,
    }),
    pageSize: Flags.integer({
      char: "s",
      description: "The page size of results..",
      default: 25,
    }),
    // TODO: add more filter options eventually
  };

  static examples = [
    `$ shabam catalog list`,
    `$ shabam catalog list -u someUsername`,
    `$ shabam catalog list -p 0 -s 10`,
  ];

  async run(): Promise<void> {
    await super.run();

    const { args, flags } = await this.parse<GetF<typeof CatalogList>, Args>(
      CatalogList
    );

    const { page, pageSize, uploader } = flags;

    if (page < 0) this.error("Page number must be positive.");
    if (pageSize < 0) this.error("Page size must be positive.");

    let tracksRet: GetTracksQuery;
    try {
      tracksRet = await this.sdkClient.GetTracks({
        limit: pageSize,
        offset: page * pageSize,
        filter: {
          uploader,
        },
      });
    } catch (err) {
      this.error(
        Utilities.prettyPrintErrors(err as ClientError, "Unable to list tracks")
      );
    }

    if (tracksRet.getTracks.length > 0) {
      this.log(Utilities.prettyPrintTracks(tracksRet.getTracks));
    } else {
      this.log(`${color.gray("No tracks found.")}`);
    }
  }
}
