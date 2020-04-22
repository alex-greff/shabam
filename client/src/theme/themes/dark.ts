import Color from "color";

const BLACK = "#000000";
const GREY_1 = "#1A1A1A";
const GREY_2 = "#3C3C3C";

const DARK_1 = "#141414";
const DARK_2 = "#313131";
const DARK_3 = "#444444";
const DARK_4 = "#707070"; // TODO: tweak this color

const LIGHT_1 = "#FFFFFF";
const LIGHT_2 = "#F6F6F6";
const LIGHT_3 = "#EAEAEA"; // TODO: tweak this color

const BLUE_1 = "#C3E2FF";
const BLUE_2 = "#3176A8";
const BLUE_3 = "#557F9D";
const BLUE_4 = "#1C6498";
const BLUE_5 = "#4BC1D1";

export default {
    name: "dark",
    theme: {
        GLOBAL: {
            background: {
                primary: DARK_1,
                secondary: DARK_2,
                tertiary: DARK_3,
                disabled: DARK_4
            },
            text: {
                primary: LIGHT_1,
                secondary: LIGHT_2,
                disabled: LIGHT_3
            },
            text_inverse: {
                primary: BLACK,
                secondary: GREY_1,
                disabled: GREY_2
            },
            accent: {
                primary: BLUE_1,
                secondary: BLUE_2,
                tertiary: BLUE_3,
                disabled: Color(BLUE_1).darken(0.2).round().toString() // TODO: tweak this
            },
            selected: {
                // TODO: find colors for these
                primary: "#FF0000",
                secondary: "#FF6800",
                tertiary: "#FF8300"
            },
            gradient: {
                start: BLUE_4,
                end: BLUE_5
            },
            gradient_selected: {
                // TODO: find colors for these
                start: "#FF0000",
                end: "#FF6800"
            },
            gradient_disabled: {
                // TODO: tweak these values
                start: Color(BLUE_4).lighten(0.2).round().toString(),
                end: Color(BLUE_5).lighten(0.2).round().toString()
            }
        }
    }
}
