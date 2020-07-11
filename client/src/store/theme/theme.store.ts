import { observable, computed, action } from "mobx";
import Themer, { Theme as ThemeSchema } from "themer";
import { schema as SCHEMA, mixins as MIXINS } from "@/theme/definition";

// -------------------------
// --- Type Declarations ---
// -------------------------

export type ThemeName = string;

export interface ThemeProperties {
  [propertyName: string]: string;
}

export interface Theme {
  name: ThemeName;
  properties: ThemeProperties;
}

interface Themes {
  [themeName: string]: Theme;
}

interface Namespaces {
  [namespaceId: string]: ThemeName;
}

// -------------------
// --- Store Class ---
// -------------------

class ThemeStore {
  @observable
  themes: Themes = {};

  @observable
  namespaces: Namespaces = {};

  // --- Helper functions ---
  private checkThemeExists(themeName: string): never | void {
    if (!this.themes[themeName]) {
      throw `Error: theme '${themeName}' does not exist`;
    }
  }

  private checkThemeDoesNotExist(themeName: string): never | void {
    if (this.themes[themeName]) {
      throw `Error: theme '${themeName}' already exists`;
    }
  }

  private checkNamespaceExists(namespaceID: string): never | void {
    if (!this.namespaces[namespaceID]) {
      throw `Error: namespace '${namespaceID}' does not exist`;
    }
  }

  private checkNamespaceDoesNotExist(namespaceID: string): never | void {
    if (this.namespaces[namespaceID]) {
      throw `Error: namespace '${namespaceID}' already exists`;
    }
  }

  // --- Computed ---
  @computed
  get allThemes() {
    return Object.values(this.themes);
  }

  @computed
  get getTheme() {
    return (name: string) => {
      return this.themes[name];
    };
  }

  @computed
  get allNamespaces() {
    return Object.values(this.namespaces);
  }

  @computed
  get getNamespace() {
    return (namespaceID: string) => {
      return this.namespaces[namespaceID];
    };
  }

  // --- Actions ---
  @action
  addTheme(name: string, themeValues: ThemeSchema, override = false) {
    // Make sure theme does not exist if we are not overriding it
    if (!override) {
      this.checkThemeDoesNotExist(name);
    }

    // Generate the theme
    const generateOptions: Themer.Options = {
      PREFIX: "--",
      CONDENSE_KEYS: true,
    };
    const generatedTheme = Themer.generate(
      themeValues,
      SCHEMA,
      MIXINS,
      {},
      generateOptions
    );

    // Add the theme
    this.themes[name] = { name, properties: generatedTheme };
  }

  @action
  removeTheme(name: string) {
    this.checkNamespaceExists(name);

    // Remove the theme
    delete this.themes[name];
  }

  @action
  editTheme(name: string, themeValues: ThemeSchema) {
    this.checkThemeExists(name);

    // Generate the updated theme
    const updatedGeneratedTheme = Themer.generate(
      themeValues,
      SCHEMA,
      MIXINS,
      {},
      { PREFIX: "--" }
    );

    // Update the theme's data
    this.themes[name] = { name, properties: updatedGeneratedTheme };
  }

  @action
  addNamespace(namespaceID: string, targetTheme: ThemeName, override = false) {
    if (!override) {
      this.checkNamespaceDoesNotExist(namespaceID);
    }

    // Add the namespace
    this.namespaces[namespaceID] = targetTheme;
  }

  @action
  removeNamespace(namespaceID: string) {
    this.checkNamespaceExists(namespaceID);

    // Remove the namespace
    delete this.namespaces[namespaceID];
  }

  @action
  editNamespace(namespaceID: string, targetTheme: ThemeName) {
    this.checkNamespaceExists(namespaceID);

    // Edit the theme target
    this.namespaces[namespaceID] = targetTheme;
  }
}

export const themeStore = new ThemeStore();
