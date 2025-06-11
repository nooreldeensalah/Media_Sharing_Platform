import { ColorSchemeName } from "react-native";

export interface Colors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryText: string;
  secondary: string;
  accent: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  surface: string;
  overlay: string;
  disabled: string;
  placeholder: string;
}

export const lightColors: Colors = {
  background: "#ffffff",
  card: "#f8f9fa",
  text: "#212529",
  textSecondary: "#6c757d",
  primary: "#007bff",
  primaryText: "#ffffff",
  secondary: "#6c757d",
  accent: "#17a2b8",
  border: "#dee2e6",
  error: "#dc3545",
  success: "#28a745",
  warning: "#ffc107",
  info: "#17a2b8",
  surface: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.5)",
  disabled: "#e9ecef",
  placeholder: "#adb5bd",
};

export const darkColors: Colors = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#ffffff",
  textSecondary: "#b3b3b3",
  primary: "#4dabf7",
  primaryText: "#ffffff",
  secondary: "#868e96",
  accent: "#69db7c",
  border: "#373737",
  error: "#ff6b6b",
  success: "#51cf66",
  warning: "#ffd43b",
  info: "#74c0fc",
  surface: "#2d2d2d",
  overlay: "rgba(0, 0, 0, 0.7)",
  disabled: "#495057",
  placeholder: "#6c757d",
};

export const getColors = (colorScheme: ColorSchemeName): Colors => {
  return colorScheme === "dark" ? darkColors : lightColors;
};
