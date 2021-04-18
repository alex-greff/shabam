import { CatalogArtist } from "@/types/catalog";
import * as BackNavigationImport from "./backNavigation";

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
      if (b.type === "featured" || b.type === "remix")
        return 1;
      return 0;
    } else if (a.type === "featured") {
      if (b.type === "primary")
        return -1;
      else if (b.type === "remix") 
        return 1;
      return 0;
    } else { // a.type === "remix"
      if (b.type === "primary" || b.type === "featured")
        return -1;
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