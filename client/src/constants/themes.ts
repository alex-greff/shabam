import { ThemeName } from "@/types";

interface ThemeOption {
  id: ThemeName;
  name: string;
}


export const themes: ThemeOption[] = [
  {
    id: "theme-light",
    name: "Light",
  },
  {
    id: "theme-dark",
    name: "Dark",
  },
];

export const defaultTheme = "theme-light";
