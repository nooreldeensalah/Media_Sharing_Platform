import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { getColors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";

export const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t } = useTranslation();

  const getIcon = () => {
    return colorScheme === "dark" ? "sunny" : "moon";
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={toggleTheme}
      accessibilityLabel={t("toggleTheme")}
      accessibilityRole="button"
      accessibilityHint="Switches between light and dark theme"
    >
      <Ionicons name={getIcon()} size={20} color={colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
