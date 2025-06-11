import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { getColors } from "../../constants/Colors";

interface LoadingProps {
  size?: "small" | "large";
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "large",
  text,
  overlay = false,
  style,
  textStyle,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    };

    if (overlay) {
      return {
        ...baseStyle,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.overlay,
        zIndex: 1000,
      };
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => ({
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  });

  return (
    <View style={[getContainerStyle(), style]}>
      <ActivityIndicator
        size={size}
        color={colors.primary}
        accessibilityLabel="Loading"
      />
      {text && <Text style={[getTextStyle(), textStyle]}>{text}</Text>}
    </View>
  );
};
