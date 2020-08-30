import { Schema, MixinDefinitions } from "themer";
import ThemeStore from "../store/theme.store";

/**
 * The theme store instance. Null if themer has not been initialized yet.
 */
export let themeStore: ThemeStore | null = null;

export interface ThemeData {
  name: string;
  theme: {
    GLOBAL: {
      [s: string]: any;
    };
    [s: string]: {
      [s: string]: any;
    };
  };
}

export interface NamespaceData {
  namespaceId: string;
  targetTheme: string;
}

/**
 * Asserts that the theme store has been initialized.
 */
export function assertInitialized() {
  if (!themeStore) throw "Error: themer-react is not initialized.";
}

/**
 * Initializes themer with the schema and mixins along with the initial theme
 * and namespace data.
 */
export function initialize(
  schema: Schema,
  mixins: MixinDefinitions,
  themes: ThemeData[],
  namespaces: NamespaceData[]
) {
  themeStore = new ThemeStore(schema, mixins);

  // Add all namespaces
  namespaces.forEach((namespaceData) => {
    themeStore!.addNamespace(
      namespaceData.namespaceId,
      namespaceData.targetTheme,
      true
    );
  });

  // Add all themes
  themes.forEach((themeData) => {
    themeStore?.addTheme(themeData.name, themeData.theme, true);
  });
}
