import { Schema, MixinDefinitions } from "themer";

export const schema: Schema = {
  GLOBAL: {
    background: {
      $mixins: [
        "primary_modifier",
        "secondary_modifier",
        "tertiary_modifier",
        "disabled_modifier",
      ],
    },
    text: {
      $mixins: ["primary_modifier", "secondary_modifier", "disabled_modifier"],
    },
    text_inverse: {
      $mixins: ["primary_modifier", "secondary_modifier", "disabled_modifier"],
    },
    accent: {
      $mixins: [
        "primary_modifier",
        "secondary_modifier",
        "tertiary_modifier",
        "disabled_modifier",
      ],
    },
    selected: {
      $mixins: ["primary_modifier", "secondary_modifier", "tertiary_modifier"],
    },
    gradient: {
      $mixins: ["start_modifier", "end_modifier"],
    },
    gradient_selected: {
      $mixins: ["start_modifier", "end_modifier"],
    },
    gradient_disabled: {
      $mixins: ["start_modifier", "end_modifier"],
    },
    form_error: {
      $mixins: ["primary_modifier", "secondary_modifier"],
    },
    error: {
      $mixins: ["primary_modifier", "secondary_modifier", "disabled_modifier"],
    },
    warning: {
      $mixins: ["primary_modifier", "secondary_modifier", "disabled_modifier"],
    },
    success: {
      $mixins: ["primary_modifier", "secondary_modifier", "disabled_modifier"],
    },
    info: {
      $mixins: ["primary_modifier", "secondary_modifier", "disabled_modifier"],
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
  Benchmark: { $inherits: "GLOBAL" },
  BenchmarkConfiguration: { $inherits: "GLOBAL" },
  BenchmarkProgress: { $inherits: "GLOBAL" },
  BenchmarkResults: { $inherits: "GLOBAL" },
  BenchmarkResultTable: { $inherits: "GLOBAL" },
  Signin: { $inherits: "GLOBAL" },
  Signup: { $inherits: "GLOBAL" },
  PageNotFound: { $inherits: "GLOBAL" },
  // Components
  Notification: { $inherits: "GLOBAL" },
  NavBar: { $inherits: "GLOBAL" },
  NavItemBase: { $inherits: "GLOBAL" },
  NavItem: { $inherits: "GLOBAL" },
  HomeNavItem: { $inherits: "GLOBAL" },
  ButtonBase: { $inherits: "GLOBAL" },
  NormalButton: { $inherits: "GLOBAL" },
  IconButton: { $inherits: "GLOBAL" },
  AccentContainer: { $inherits: "GLOBAL" },
  FormButton: { $inherits: "GLOBAL" },
  FormInput: { $inherits: "GLOBAL" },
  NumberInput: { $inherits: "GLOBAL" },
  SearchScene: { $inherits: "GLOBAL" },
  DividerLine: { $inherits: "GLOBAL" },
  CircularButton: { $inherits: "GLOBAL" },
  RecordButton: { $inherits: "GLOBAL" },
  StopButton: { $inherits: "GLOBAL" },
  SpectrogramChart: { 
    $inherits: "GLOBAL",
    color_scale: {
      $mixins: ["color_scale_modifiers"]
    },
    partition_dividers: {
      color_1: {
        $type: "color",
        $required: true
      },
      color_2: {
        $type: "color",
        $required: true
      }
    }
  },
  FingerprintChart: { 
    $inherits: "GLOBAL",
    selection_color: {
      $type: "color",
      $required: true
    },
    partition_dividers: {
      color_1: {
        $type: "color",
        $required: true
      },
      color_2: {
        $type: "color",
        $required: true
      }
    }
  },
};

export const mixins: MixinDefinitions = {
  // --- Modifiers ---
  primary_modifier: {
    primary: {
      $type: "color",
      $required: true,
    },
  },
  secondary_modifier: {
    secondary: {
      $type: "color",
      $required: true,
    },
  },
  tertiary_modifier: {
    tertiary: {
      $type: "color",
      $required: true,
    },
  },
  quaternary_modifier: {
    quaternary: {
      $type: "color",
      $required: true,
    },
  },
  disabled_modifier: {
    disabled: {
      $type: "color",
      $required: true,
    },
  },
  start_modifier: {
    start: {
      $type: "color",
      $required: true,
    },
  },
  end_modifier: {
    end: {
      $type: "color",
      $required: true,
    },
  },
  background_modifier: {
    background: {
      $type: "color",
      $required: true,
    },
  },
  text_modifier: {
    text: {
      $type: "color",
      $required: true,
    },
  },
  accent_modifier: {
    accent: {
      $type: "color",
      $required: true,
    },
  },
  status_modifiers: {
    ready: {
      $type: "color",
      $required: true,
    },
    syncing: {
      $type: "color",
      $required: true,
    },
    uploading: {
      $type: "color",
      $required: true,
    },
    loading: {
      $type: "color",
      $required: true,
    },
    error: {
      $type: "color",
      $required: true,
    },
  },
  hue_rotate_modifiers: {
    color_1: {
      $type: "color",
      $required: true,
    },
    color_2: {
      $type: "color",
      $required: true,
    },
    color_3: {
      $type: "color",
      $required: true,
    },
    color_4: {
      $type: "color",
      $required: true,
    },
    color_5: {
      $type: "color",
      $required: true,
    },
    color_6: {
      $type: "color",
      $required: true,
    },
  },
  color_scale_modifiers: {
    color_1: {
      $type: "color",
      $required: true,
    },
    color_2: {
      $type: "color",
      $required: true,
    },
    color_3: {
      $type: "color",
      $required: true,
    },
    color_4: {
      $type: "color",
      $required: true,
    }
  }
};
