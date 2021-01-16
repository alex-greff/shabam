import { useContext, useMemo } from "react";
import Color from "color";
import ThemeContext from "@/contexts/theme.context";

export function useColorLink(varInput: string, opacity = 1) {
  const { theme } = useContext(ThemeContext);

  varInput = (!varInput.startsWith("--")) ? `--${varInput}` : varInput;

  // Update the color value whenever the theme changes
  const colorValue = useMemo(() => {
    const rgbString = window.getComputedStyle(document.body).getPropertyValue(varInput);
    const clr = Color.rgb(`rgb(${rgbString})`).alpha(opacity);
    return clr;
  }, [theme, varInput, opacity]);

  return colorValue;
}