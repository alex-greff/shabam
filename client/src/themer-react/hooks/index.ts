import { useObserver } from "mobx-react";
import { themeStore, assertInitialized } from "../controller";
import { Theme } from "../store/theme.store";
import { PREFIX, SEPARATOR } from "../constants";

/**
 * React hook that gives the theme data that the namespace points to.
 */
export function useNamespace(namespaceId: string) {
  assertInitialized();

  return useObserver(() => {
    const themeName = themeStore!.getNamespace(namespaceId);
    if (!themeName)
      return undefined;
    const theme = themeStore!.getTheme(themeName);
    return theme;
  });
}

/**
 * React hook that gives the theme data that the theme name points to.
 */
export function useTheme(themeName: string) {
  assertInitialized();

  return useObserver(() => {
    const theme = themeStore!.getTheme(themeName);
    return theme;
  });
}

/**
 * React hook that gives the value at `path` of `themeData`.
 */
export function useThemeLink(themeData: Theme, ...path: string[]) {
  // Look up theme property at `path`
  const key = `${PREFIX}${path.join(SEPARATOR)}`;
  return themeData.properties[key] as string | undefined;
}