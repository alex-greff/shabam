import { Flags } from "@oclif/core";
import { AuthenticatedCommand } from "../../base/AuthenticatedCommand";
import { GetF } from "../../types";
import * as fs from "fs";
import { WaveFile } from "wavefile";
import * as Utilities from "../../utilities";
import * as GraphqlUtilities from "../../utilities/graphql";
import { ClientError } from "graphql-request";
import { AddTrackMutation } from "../../graphql-request.g";

interface Args {
  file: string;
}

export default class CatalogAdd extends AuthenticatedCommand {
  static description = "Upload and add new track to Shabam database.";

  static args = [
    ...(AuthenticatedCommand.args ?? []),
    {
      name: "file",
      description: "File path to track that will be uploaded.",
      required: true,
    },
  ];

  static flags = {
    ...AuthenticatedCommand.flags,
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
    await super.run();

    const { args, flags } = await this.parse<GetF<typeof CatalogAdd>, Args>(
      CatalogAdd
    );

    const { file } = args;
    const {
      title,
      coverArt,
      primaryAuthor: primaryAuthors,
      featuredAuthor: featuredAuthors,
      remixAuthor: remixAuthors,
      releaseDate: releaseDateStr,
    } = flags;

    // Ensure release date is valid
    let releaseDate: Date | undefined;
    try {
      releaseDate = releaseDateStr ? new Date(releaseDateStr) : undefined;
    } catch (err) {
      this.error("Invalid release date provided.");
    }

    // Verify audio file exists
    const exists = await fs.promises
      .access(file, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
    if (!exists) this.error("Unable to read audio file.");

    // Make sure it is a .wav file
    const audioFileBuf = await fs.promises.readFile(file);
    let audioFile: WaveFile;
    try {
      audioFile = new WaveFile(audioFileBuf);
    } catch (err) {
      this.error("Unable to read WAV file.");
    }
    const audioFileStream = fs.createReadStream(file);

    try {
      await this.sdkClient.AddTrack({
        trackData: {
          title,
          // TODO: implement coverImage,
          releaseDate: releaseDate?.toUTCString(),
          artists: GraphqlUtilities.toArtistInput(
            primaryAuthors,
            featuredAuthors,
            remixAuthors
          ),
          audioFile: audioFileStream,
        },
      });
    } catch (err) {
      this.error(
        Utilities.prettyPrintErrors(
          err as ClientError,
          "Unable to create track"
        )
      );
    }

    this.log("Successfully created track!");
  }
}
