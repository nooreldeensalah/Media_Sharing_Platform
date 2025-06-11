import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { getColors } from "../../constants/Colors";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  children,
  style,
  textStyle,
  accessibilityLabel,
  onPress,
  ...props
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);

  const isDisabled = disabled || loading;

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: 8,
      ...getSizeStyles(),
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? colors.disabled : colors.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? colors.disabled : colors.secondary,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: isDisabled ? colors.disabled : colors.primary,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? colors.disabled : colors.error,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          minHeight: 36,
        };
      case "medium":
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 44,
        };
      case "large":
        return {
          paddingHorizontal: 20,
          paddingVertical: 16,
          minHeight: 52,
        };
      default:
        return {};
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    switch (size) {
      case "small":
        baseTextStyle.fontSize = 14;
        break;
      case "medium":
        baseTextStyle.fontSize = 16;
        break;
      case "large":
        baseTextStyle.fontSize = 18;
        break;
    }

    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        baseTextStyle.color = colors.primaryText;
        break;
      case "outline":
        baseTextStyle.color = isDisabled ? colors.disabled : colors.primary;
        break;
      case "ghost":
        baseTextStyle.color = isDisabled ? colors.disabled : colors.primary;
        break;
    }

    if (isDisabled) {
      baseTextStyle.color = colors.textSecondary;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? colors.primary
              : colors.primaryText
          }
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[getTextStyles(), textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};
