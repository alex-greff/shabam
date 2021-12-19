import { Flags } from "@oclif/core";
import { AuthenticatedCommand } from "../../base/AuthenticatedCommand";
import { GetF } from "../../types";

interface Args {}

export default class CatalogList extends AuthenticatedCommand {
  static description = "List the tracks in the Shabam catalog.";

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

    this.log("TODO: implement catalog list");
  }
}
