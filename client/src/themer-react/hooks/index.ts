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
    if (!themeName) return undefined;
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
 * React hook that gives the value at `path` of `themeData`. Assumes the
 * endpoint is a normalized color value.
 */
export function useThemeLink(
  themeData: Theme,
  ...path: string[]
): string | undefined;
export function useThemeLink<T extends string[]>(
  themeData: Theme,
  ...path: [...T, number]
): string | undefined;
export function useThemeLink(
  themeData: Theme,
  ...path: any[]
): string | undefined  {
  const hasNumLast = typeof path[path.length - 1] === "number";

  // Remove last element from path, if it is a number (i.e an opacity value)
  const opacity = (hasNumLast) ? path.splice(path.length - 1, 1)[0] : 1;

  // Construct lookup key
  const key = `${PREFIX}${path.join(SEPARATOR)}`;

  // Look up theme property at `path`
  const colorValue = themeData.properties[key] as string | undefined;
  return colorValue ? `rgba(${colorValue}, ${opacity})` : undefined;
}
