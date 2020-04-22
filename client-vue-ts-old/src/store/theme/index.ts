import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Themer, { Theme as ThemeSchema } from "themer";
import { schema as SCHEMA, mixins as MIXINS } from "../../theme/definition";
import { namespace } from "vuex-class";


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

interface ThemePayload {
    name: ThemeName;
    themeValues: ThemeSchema;
    override: boolean;
}

interface NamespacePayload {
    name: string;
    targetTheme: ThemeName;
    override: boolean;
}

// -----------------------------------
// --- Component Mixin Declaration ---
// -----------------------------------
const UserStore = namespace("user");

export class ComponentMixin extends Vue {
    @UserStore.Action
    public addTheme!: (payload: ThemePayload) => void;
}

// --------------------------
// --- Module Declaration ---
// --------------------------

@Module({ namespaced: true, name: "theme" })
export default class ThemeStore extends VuexModule {
    themes: { [themeName: string]: Theme; } = {};
    namespaces: { [namespaceID: string ]: ThemeName } = {};

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

    get allThemes() {
        return Object.values(this.themes);
    }

    get getTheme() {
        return (themeName: string) => {
            return this.themes[themeName];
        }
    }

    get allNamespaces() {
        return Object.values(this.namespaces);
    }

    get getNamespace() {
        return (namespaceID: string) => {
            return this.namespaces[namespaceID];
        }
    }

    @Mutation
    m_addTheme({ name, themeValues, override }: ThemePayload) {
        // Make sure theme does not exist if we are not overriding it
        if (!override) {
            this.checkThemeDoesNotExist(name);
        }

        // Generate the theme
        const generateOptions: Themer.Options = {
            PREFIX: "--",
            CONDENSE_KEYS: true
        };
        const generatedTheme = Themer.generate(themeValues, SCHEMA, MIXINS, {}, generateOptions);

        // Add the theme
        Vue.set(this.themes, name, { name, properties: generatedTheme });
    }

    @Mutation
    m_removeTheme({ name }: Omit<ThemePayload, "themeValues" | "override">) {
        this.checkNamespaceExists(name);

        // Remove the theme
        Vue.delete(this.themes, name);
    }

    @Mutation
    m_editTheme({ name, themeValues }: Omit<ThemePayload, "override">) {
        this.checkThemeExists(name);

        // Generate the updated theme
        const updatedGeneratedTheme = Themer.generate(themeValues, SCHEMA, MIXINS, {}, { PREFIX: "--" });

        // Update the theme's data
        Vue.set(this.themes, name, { name, properties: updatedGeneratedTheme });
    }

    @Mutation
    m_addNamespace({ name, targetTheme, override }: NamespacePayload) {
        if (!override) {
            this.checkNamespaceDoesNotExist(name);
        }

        // Add the namespace
        Vue.set(this.namespaces, name, targetTheme);
    }

    @Mutation
    m_removeNamespace({ name }: Omit<NamespacePayload, "targetTheme" | "override">) {
        this.checkNamespaceExists(name);

        // Remove the namespace
        Vue.delete(this.namespaces, name);
    }

    @Mutation
    m_editNamespace({ name, targetTheme }: Omit<NamespacePayload, "override">) {
        this.checkNamespaceExists(name);

        // Edit the theme target        
        Vue.set(this.namespaces, name, targetTheme);
    }

    @Action({ commit: "m_addTheme" })
    addTheme(payload: ThemePayload) {
        return payload;
    }

    @Action({ commit: "m_removeTheme" })
    removeTheme(payload: Omit<ThemePayload, "themeValues" | "override">) {
        return payload;
    }

    @Action({ commit: "m_editTheme" })
    editTheme(payload: Omit<ThemePayload, "override">) {
        return payload;
    }

    @Action({ commit: "m_addNamespace" })
    addNamespace(payload: NamespacePayload) {
        return payload;
    }

    @Action({ commit: "m_removeNamespace" })
    removeNamespace(payload: Omit<NamespacePayload, "targetTheme" | "override">) {
        return payload;
    }

    @Action({ commit: "m_editNamespace" })
    editNamespace(payload: Omit<NamespacePayload, "override">) {
        return payload;
    }
}