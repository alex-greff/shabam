import { ClientError, GraphQLClient } from "graphql-request";
import {
  CollaborationType,
  getSdk,
  GetTracksQuery,
  Sdk,
} from "../graphql-request.g";
import KEYS from "../keys";
import color from "@oclif/color";
import { ArrayElement } from "./types";
import { assert } from "tsafe";
import "moment-duration-format";
import moment from "moment";

/**
 * Returns given string with a trailing slash, if it does not have it already.
 */
export function trailingSlash(s: string) {
  return s.endsWith("/") ? s : `${s}/`;
}

export function getGraphqlClient(token?: string): GraphQLClient {
  const client = new GraphQLClient(
    KEYS.GRAPHQL_API_URL,
    token ? { headers: { authorization: `Bearer ${token}` } } : undefined
  );
  return client;
}

export function getGraphqlClientSdk(token?: string): Sdk {
  const client = getGraphqlClient(token);
  const sdk = getSdk(client);

  return sdk;
}

export const commaSeparateNum = (num: number) => {
  return String(num).replace(/^\d+/, (number) =>
    [...number]
      .map(
        (digit, index, digits) =>
          (!index || (digits.length - index) % 3 ? "" : ",") + digit
      )
      .join("")
  );
};

export const formatPlays = (plays: number) => {
  // Sources:
  // - https://stackoverflow.com/a/55987576/13161942
  // - https://stackoverflow.com/a/65345466/13161942
  if (plays < 10e3) return commaSeparateNum(plays);
  if (plays >= 10e3 && plays < 1e6) return +(plays / 1e3).toFixed(1) + "K";
  if (plays >= 1e6 && plays < 1e9) return +(plays / 1e6).toFixed(1) + "M";
  if (plays >= 1e9 && plays < 1e12) return +(plays / 1e9).toFixed(1) + "B";
  if (plays >= 1e12) return +(plays / 1e12).toFixed(1) + "T";
  return plays.toString();
};

export const formatArtists = (
  artists: ArrayElement<GetTracksQuery["getTracks"]>["metadata"]["artists"]
) => {
  const primaries: string[] = [];
  const features: string[] = [];
  const remixes: string[] = [];

  artists.forEach((artist) => {
    if (artist.type === CollaborationType.Primary) primaries.push(artist.name);
    else if (artist.type === CollaborationType.Featured)
      features.push(artist.name);
    else remixes.push(artist.name);
  });

  let ret = `${primaries.join(", ")}`;
  if (features.length > 0) ret += ` ft. ${features.join(", ")}`;
  if (remixes.length > 0) ret += ` (${remixes.join(", ")} remix)`;

  return ret;
};

export const formatDuration = (duration: number): string => {
  const dur = moment
    .duration(duration, "seconds")
    .format("hh:mm:ss", { trim: "largest", stopTrim: "mm" });
  return dur;
};

export const formatDate = (date: Date | string): string => {
  const format = "YYYY-MM-DD HH:mm:ss";
  return moment(date).format(format);
};

export function fitStrToSize(
  str: string,
  size: number,
  paddingChar = " "
): string {
  assert(size > 3);

  // String size is too big, add ellipses
  if (str.length > size) return str.slice(0, -3) + "...";

  return str.padEnd(size, paddingChar);
}

export function prettyPrintErrors(
  clientErr: ClientError,
  prefixText?: string
): string {
  try {
    let errStr = `${prefixText ?? "An error occurred"}`;
    const errors = clientErr.response.errors ?? [];
    for (let error of errors) {
      const carrotPrefix = color.blueBright(">");
      const errorCode = error.extensions?.exception?.status as number | undefined;
      const errorCodePrefix = errorCode ? `[${color.red(errorCode)}] ` : "";
      const errorCodeMessage = error.message;
      errStr += `\n${carrotPrefix} ${errorCodePrefix}${errorCodeMessage}`;
    }
    return errStr;
  } 
  catch(err) {
    // Just rethrow if something went wrong (i.e. passed in wrong type)
    throw err;
  }
}

export function prettyPrintTrack(
  track: ArrayElement<GetTracksQuery["getTracks"]>
): string {
  const metadata = track.metadata;

  const carrotPrefix = color.blueBright(">");
  const trackIdAndAddrDbStr = `[${color.blueBright(track.id)}:${color.gray(
    track.addressDatabase
  )}]`;
  const titleStr = fitStrToSize(metadata.title, 15);
  const durationStr = `${color.grey("Time:")} ${formatDuration(
    metadata.duration
  )}`;
  const playsStr = `${color.grey("Searches:")} ${formatPlays(
    metadata.numPlays
  )}`;
  const createdDateStr = `${color.grey("Created:")} ${formatDate(
    metadata.createdDate
  )}`;

  const updatedDateStr = `${color.grey("Updated:")} ${formatDate(
    metadata.updatedDate
  )}`;

  let trackStr = `${carrotPrefix} ${trackIdAndAddrDbStr} ${titleStr}  ${durationStr}  ${playsStr}  ${createdDateStr}  ${updatedDateStr}`;

  const artistsStr = `${color.grey("Artists:")} ${formatArtists(
    metadata.artists
  )}`;

  console.log(metadata.artists);

  const artistsPaddingLen =
    2 +
    `[${track.id}:${track.addressDatabase}]`.length +
    1 +
    titleStr.length +
    2;
  const artistsPadding = "".padStart(artistsPaddingLen);
  trackStr += `\n${artistsPadding}${artistsStr}`;

  return trackStr;
}

export function prettyPrintTracks(tracks: GetTracksQuery["getTracks"]): string {
  let tracksStr = "Tracks:";
  for (let track of tracks) {
    tracksStr += `\n${prettyPrintTrack(track)}`;
  }

  return tracksStr;
}
