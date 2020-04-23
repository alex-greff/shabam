/* eslint-disable @typescript-eslint/camelcase */
import { Schema, MixinDefinitions } from "themer";

export const schema: Schema = {
    GLOBAL: {
        background: {
            $mixins: ['primary_modifier', 'secondary_modifier', 'tertiary_modifier', 'disabled_modifier']
        },
        text: {
            $mixins: ['primary_modifier', 'secondary_modifier', 'disabled_modifier']
        },
        text_inverse: {
            $mixins: ['primary_modifier', 'secondary_modifier', 'disabled_modifier']
        },
        accent: {
            $mixins: ['primary_modifier', 'secondary_modifier', 'tertiary_modifier', 'disabled_modifier']
        },
        selected: {
            $mixins: ['primary_modifier', 'secondary_modifier', 'tertiary_modifier']
        },
        gradient: {
            $mixins: ['start_modifier', 'end_modifier']
        },
        gradient_selected: {
            $mixins: ['start_modifier', 'end_modifier']
        },
        gradient_disabled: {
            $mixins: ['start_modifier', 'end_modifier']
        }
    },
    // --- Component Scope Declarations ---
    // Views
    Home: { $inherits: "GLOBAL" },
    Account: { $inherits: "GLOBAL" },
    AccountCatalog: { $inherits: "GLOBAL" },
    AccountSearchHistory: { $inherits: "GLOBAL" },
    Catalog: { $inherits: "GLOBAL" },
    Search: { $inherits: "GLOBAL" },
    Signin: { $inherits: "GLOBAL" },
    Signup: { $inherits: "GLOBAL" },
    PageNotFound: { $inherits: "GLOBAL" },
    // Components
    NavBar: { $inherits: "GLOBAL" },
    NavItemBase: { $inherits: "GLOBAL" },
    NavItem: { $inherits: "GLOBAL" },
    HomeNavItem: { $inherits: "GLOBAL" },
};

export const mixins: MixinDefinitions = {
    // --- Modifiers ---
    primary_modifier: {
        primary: {
            $type: "color",
            $required: true
        }
    },
    secondary_modifier: {
        secondary: {
            $type: "color",
            $required: true
        }
    },
    tertiary_modifier: {
        tertiary: {
            $type: "color",
            $required: true
        },
    },
    quaternary_modifier: {
        quaternary: {
            $type: "color",
            $required: true
        }
    },
    disabled_modifier: {
        disabled: {
            $type: "color",
            $required: true
        }
    },
    start_modifier: {
        start: {
            $type: "color",
            $required: true
        }
    },
    end_modifier: {
        end: {
            $type: "color",
            $required: true
        }
    },
    background_modifier: {
        background: {
            $type: "color",
            $required: true
        }
    },
    text_modifier: {
        text: {
            $type: "color",
            $required: true
        }
    },
    accent_modifier: {
        accent: {
            $type: "color",
            $required: true
        }
    },
    status_modifiers: {
        ready: {
            $type: "color",
            $required: true
        },
        syncing: {
            $type: "color",
            $required: true
        },
        uploading: {
            $type: "color",
            $required: true
        },
        loading: {
            $type: "color",
            $required: true
        },
        error: {
            $type: "color",
            $required: true
        }
    },
    hue_rotate_modifiers: {
        color_1: {
            $type: "color",
            $required: true
        },
        color_2: {
            $type: "color",
            $required: true
        },
        color_3: {
            $type: "color",
            $required: true
        },
        color_4: {
            $type: "color",
            $required: true
        },
        color_5: {
            $type: "color",
            $required: true
        },
        color_6: {
            $type: "color",
            $required: true
        }
    }
};