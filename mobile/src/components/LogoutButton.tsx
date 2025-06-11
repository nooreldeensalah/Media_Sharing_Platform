// src/components/LogoutButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { LogoutButtonProps } from "../types";

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      accessibilityLabel="Logout"
      accessibilityRole="button"
    >
      <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default LogoutButton;
