import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { getColors } from "../../constants/Colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  required = false,
  showPasswordToggle = false,
  secureTextEntry: initialSecureTextEntry = false,
  ...props
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const [secureTextEntry, setSecureTextEntry] = useState(
    initialSecureTextEntry,
  );
  const [isFocused, setIsFocused] = useState(false);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: error
      ? colors.error
      : isFocused
        ? colors.primary
        : colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: leftIcon ? 8 : 0,
  });

  const getHelperTextStyle = (): TextStyle => ({
    fontSize: 14,
    marginTop: 4,
    color: error ? colors.error : colors.textSecondary,
  });

  const getIconColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.textSecondary;
  };

  const displayRightIcon = showPasswordToggle
    ? secureTextEntry
      ? "eye-off"
      : "eye"
    : rightIcon;

  const handleRightIconPress = showPasswordToggle
    ? toggleSecureTextEntry
    : onRightIconPress;

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}

      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={20} color={getIconColor()} />
        )}

        <TextInput
          style={[getInputStyle(), inputStyle]}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.placeholder}
          accessibilityLabel={label}
          accessibilityHint={helper}
          {...props}
        />

        {displayRightIcon && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            accessibilityLabel={
              showPasswordToggle ? "Toggle password visibility" : "Icon button"
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={displayRightIcon}
              size={20}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>

      {(error || helper) && (
        <Text style={[getHelperTextStyle(), error ? errorStyle : helperStyle]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
};
