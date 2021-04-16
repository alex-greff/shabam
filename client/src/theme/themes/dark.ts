import Color from "color";
import { ThemeData } from "@/themer-react";

const BLACK = "#000000";
const GREY_1 = "#1A1A1A";
const GREY_2 = "#3C3C3C";

const DARK_1 = "#141414";
const DARK_2 = "#313131";
const DARK_3 = "#444444";
const DARK_4 = "#707070"; // TODO: tweak this color
const DARK_5 = "#646464";
const DARK_6 = "#494747";
const DARK_7 = "#6A6A6A";
const DARK_8 = "#C0C0C0";
const DARK_9 = "#737373";
const DARK_10 = "#555555";

const LIGHT_1 = "#FFFFFF";
const LIGHT_2 = "#F6F6F6";
const LIGHT_3 = "#C3C3C3"; // TODO: tweak this color
const LIGHT_4 = "#BFBFBF";

const BLUE_1 = "#C3E2FF";
const BLUE_2 = "#3176A8";
const BLUE_3 = "#557F9D";
const BLUE_4 = "#1C6498";
const BLUE_5 = "#4BC1D1";
const BLUE_6 = "#B3F6FF";
const BLUE_7 = "#6AE8F9";
const BLUE_8 = "#64829E";
const BLUE_9 = "#4A5E72";
const BLUE_10 = "#4D5965";
const BLUE_11 = "#CCD7E2";
const BLUE_12 = "#479AB4";
const BLUE_13 = "#7890A6";

const FORM_ERROR_1 = "#F08787";
const FORM_ERROR_2 = "#523B3B";

const ERROR_1 = "#D44B4B";
const ERROR_2 = "#CD5757";
const WARNING_1 = "#D4B64B";
const WARNING_2 = "#C0AB60";
const SUCCESS_1 = "#4ED44B";
const SUCCESS_2 = "#31A861";
const INFO_1 = "#4BB4D4";

const SEARCH_SCENE_ACCENT_1 = "#4240C9";
const SEARCH_SCENE_ACCENT_2 = "#4A6ABE";
const SEARCH_SCENE_ACCENT_3 = "#6B69D7";

const RED = "#FF0000";

export default {
  name: "dark",
  theme: {
    GLOBAL: {
      background: {
        primary: DARK_1,
        secondary: DARK_2,
        tertiary: DARK_3,
        disabled: DARK_4,
      },
      text: {
        primary: LIGHT_1,
        secondary: LIGHT_2,
        disabled: LIGHT_3,
      },
      text_inverse: {
        primary: BLACK,
        secondary: GREY_1,
        disabled: GREY_2,
      },
      accent: {
        primary: BLUE_1,
        secondary: BLUE_2,
        tertiary: BLUE_3,
        disabled: BLUE_11,
      },
      selected: {
        // TODO: find colors for these
        primary: BLUE_6,
        secondary: BLUE_7,
        tertiary: "#FF8300",
      },
      gradient: {
        start: BLUE_4,
        end: BLUE_5,
      },
      gradient_selected: {
        // TODO: find colors for these
        start: "#FF0000",
        end: "#FF6800",
      },
      gradient_disabled: {
        // TODO: tweak these values
        start: Color(BLUE_4).lighten(0.2).round().toString(),
        end: Color(BLUE_5).lighten(0.2).round().toString(),
      },
      form_error: {
        primary: FORM_ERROR_1,
        secondary: FORM_ERROR_2,
      },
      error: {
        primary: ERROR_1,
        secondary: Color(ERROR_1).darken(0.2).round().toString(),
        disabled: Color(ERROR_1).desaturate(0.5).round().toString(),
      },
      warning: {
        primary: WARNING_1,
        secondary: Color(WARNING_1).darken(0.2).round().toString(),
        disabled: Color(WARNING_1).desaturate(0.5).round().toString(),
      },
      success: {
        primary: SUCCESS_1,
        secondary: Color(SUCCESS_1).darken(0.2).round().toString(),
        disabled: Color(SUCCESS_1).desaturate(0.5).round().toString(),
      },
      info: {
        primary: INFO_1,
        secondary: Color(INFO_1).darken(0.2).round().toString(),
        disabled: Color(INFO_1).desaturate(0.5).round().toString(),
      },
    },
    Notification: {
      background: {
        primary: DARK_3,
      },
    },
    NavBar: {
      background: {
        primary: BLUE_8,
      },
    },
    DividerLine: {
      text: {
        secondary: DARK_8,
      },
      background: {
        primary: BLUE_8,
      },
    },
    DiagonalDividerLine: {
      text: {
        secondary: DARK_8,
      },
      background: {
        primary: BLUE_8,
      },
    },
    NormalButton: {
      accent: {
        primary: BLUE_9,
        secondary: BLUE_11,
        disabled: DARK_5,
      },
      error: {
        primary: ERROR_2,
        secondary: Color(ERROR_2).darken(0.05).round().toString(),
        disabled: Color(ERROR_2).desaturate(0.5).round().toString(),
      },
      success: {
        primary: SUCCESS_2,
        secondary: Color(SUCCESS_2).darken(0.1).round().toString(),
        disabled: Color(SUCCESS_2).desaturate(0.5).round().toString(),
      },
      warning: {
        primary: WARNING_2,
        secondary: Color(WARNING_2).darken(0.1).round().toString(),
        disabled: Color(WARNING_2).desaturate(0.5).round().toString(),
      },
      info: {
        primary: BLUE_12,
        secondary: Color(BLUE_12).darken(0.1).round().toString(),
        disabled: Color(BLUE_12).desaturate(0.5).round().toString(),
      },
      blue: {
        primary: BLUE_2,
        secondary: Color(BLUE_2).darken(0.1).round().toString(),
        disabled: Color(BLUE_2).desaturate(0.5).round().toString(),
      },
      grey: {
        primary: DARK_7,
        secondary: Color(DARK_7).darken(0.1).round().toString(),
        disabled: Color(DARK_7).desaturate(0.5).lighten(0.2).round().toString(),
      },
    },
    IconButton: {
      accent: {
        primary: BLUE_6,
        secondary: Color(BLUE_6).desaturate(0.3).round().toString(),
      },
    },
    FormInput: {
      text: {
        secondary: LIGHT_4,
      },
      background: {
        primary: DARK_6,
      },
      accent: {
        secondary: BLUE_3,
        tertiary: BLUE_10,
      },
    },
    FormButton: {
      background: {
        primary: BLUE_2,
        secondary: DARK_7,
        disabled: DARK_6,
      },
      accent: {
        primary: BLUE_3,
      },
    },
    SearchScene: {
      accent: {
        primary: SEARCH_SCENE_ACCENT_1,
        secondary: SEARCH_SCENE_ACCENT_2,
        tertiary: SEARCH_SCENE_ACCENT_3,
      },
    },
    Home: {
      background: {
        primary: BLUE_6,
      },
    },
    Benchmark: {
      text: {
        secondary: DARK_8,
      },
    },
    BenchmarkResultTable: {
      text: {
        secondary: BLUE_6
      },
      background: {
        primary: "#4F4F4F",
        secondary: "#404040"
      },
    },
    RecordButton: {
      accent: {
        primary: RED,
        secondary: Color(RED).darken(0.2).round().toString(),
        disabled: Color(RED).desaturate(0.5).round().toString(),
      },
    },
    SpectrogramChart: {
      color_scale: {
        color_1: "rgb(0, 0, 0)",
        color_2: "rgb(8, 79, 200)",
        color_3: "rgb(0, 252, 239)",
        color_4: "rgb(255, 255, 255)"
      },
      partition_dividers: {
        color_1: "rgb(80, 80, 80)",
        color_2: "rgb(100, 100, 100)"
      }
    },
    FingerprintChart: {
      selection_color: "#08B4F4",
      partition_dividers: {
        color_1: "rgb(80, 80, 80)",
        color_2: "rgb(100, 100, 100)"
      }
    },
    NumberInput: {
      background: {
        primary: DARK_9,
        disabled: Color(DARK_9).lighten(0.3).round().toString()
      },
      accent: {
        primary: DARK_10,
        secondary: BLUE_10,
        tertiary: BLUE_3,
        disabled: Color(DARK_10).lighten(0.5).round().toString()
      }
    },
    SelectDropdown: {
      background: {
        primary: DARK_7,
        secondary: Color(DARK_7).darken(0.1).round().toString(),
        disabled: Color(DARK_7).lighten(0.4).round().toString()
      },
      selected: {
        primary: BLUE_8
      }
    },
    Chip: {
      background: {
        primary: BLUE_13,
        secondary: Color(BLUE_13).darken(0.1).round().toString(),
        disabled: Color(BLUE_13).lighten(0.1).round().toString(),
      }
    }
  }
} as ThemeData;
