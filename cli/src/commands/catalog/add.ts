import { Command, Flags,  } from "@oclif/core";
import { GetF } from "../../utilities";

interface Args {
  file: string;
}

export default class CatalogAdd extends Command {
  static description = "Upload and add new track to Shabam database.";

  static args = [
    {
      name: "file",
      description: "File path to track that will be uploaded.",
      required: true,
    },
  ];

  static flags = {
    title: Flags.string({
      char: "t",
      description: "Title of the track.",
      required: true,
    }),
    primaryAuthor: Flags.string({
      char: "a",
      description: "A primary author for the track.",
      required: true,
      multiple: true,
    }),
    featuredAuthor: Flags.string({
      char: "f",
      description: "A featured author for the track.",
      required: false,
      multiple: true,
    }),
    remixAuthor: Flags.string({
      char: "r",
      description: "A remix author for the track.",
      required: false,
      multiple: true,
    }),
    releaseDate: Flags.string({
      char: "d",
      description: "The release date for the track.",
      required: false,
    }),
    coverArt: Flags.string({
      char: "c",
      description: "The file path cover art image for the track.",
      required: false,
    }),
  };

  static examples = [
    `$ shabam catalog add path/to/track -t 'My Track Name' -a 'My Author'`,
    // TODO: add more examples
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse<GetF<typeof CatalogAdd>, Args>(CatalogAdd);

    this.log("TODO: implement upload");
  }
}
