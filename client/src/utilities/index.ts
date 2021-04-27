import { CatalogArtist } from "@/types/catalog";
import * as BackNavigationImport from "./backNavigation";
import moment from "moment";
import "moment-duration-format";

export const BackNavigation = BackNavigationImport.default;

export enum Breakpoint {
  phone = 0,
  tabPort = 1,
  tabLand = 2,
  normal = 3,
  bigDesktop = 4,
}

/**
 * Gets the current breakpoint for the given screen width.
 *
 * @param width The screen width.
 */
export const getBreakpoint = (width: number): Breakpoint => {
  if (width <= 600) {
    return Breakpoint.phone;
  } else if (width <= 900) {
    return Breakpoint.tabPort;
  } else if (width <= 1200) {
    return Breakpoint.tabLand;
  } else if (width <= 1800) {
    return Breakpoint.normal;
  } else {
    return Breakpoint.bigDesktop;
  }
};

let lastId = -1;
export const generateId = (prefix = "id-") => {
  lastId++;
  return `${prefix}${lastId}`;
};

export const sortArtistsByType = (artists: CatalogArtist[]) => {
  return artists.sort((a, b) => {
    if (a.type === "primary") {
      if (b.type === "featured" || b.type === "remix") return 1;
      return 0;
    } else if (a.type === "featured") {
      if (b.type === "primary") return -1;
      else if (b.type === "remix") return 1;
      return 0;
    } else {
      // a.type === "remix"
      if (b.type === "primary" || b.type === "featured") return -1;
      return 0;
    }
  });
};

export const sleep = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
};

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

export const formatArtists = (artists: CatalogArtist[]) => {
  const primaries: string[] = [];
  const features: string[] = [];
  const remixes: string[] = [];

  artists.forEach((artist) => {
    if (artist.type === "primary") primaries.push(artist.name);
    else if (artist.type === "featured") features.push(artist.name);
    else remixes.push(artist.name);
  });

  let ret = `${primaries.join(", ")}`;
  if (features.length > 0) ret += ` ft. ${features.join(", ")}`;
  if (remixes.length > 0) ret += ` (${remixes.join(", ")} remix)`;

  return ret;
};

export const formatDuration = (duration: number) => {
  const dur = moment
    .duration(duration, "milliseconds")
    .format("hh:mm:ss", { trim: "largest", stopTrim: "mm" });
  return dur;
};
