import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { getColors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";

interface UploadIndicatorProps {
  visible: boolean;
  fileName?: string;
  isVideo?: boolean;
}

export const UploadIndicator: React.FC<UploadIndicatorProps> = ({
  visible,
  fileName,
  isVideo = false,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.primary + "15" }]}
    >
      <View style={styles.content}>
        <ActivityIndicator size="small" color={colors.primary} />
        <View style={styles.textContainer}>
          <Text
            style={[styles.text, { color: colors.primary }]}
            numberOfLines={1}
          >
            {isVideo ? t("uploadingVideo") : t("uploadingImage")}
          </Text>
          {fileName && (
            <Text
              style={[styles.fileName, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {fileName}
            </Text>
          )}
        </View>
        <Ionicons
          name={isVideo ? "videocam" : "image"}
          size={16}
          color={colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  textContainer: {
    flex: 1,
    minWidth: 0, // Allow text to shrink
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
  },
  fileName: {
    fontSize: 11,
    marginTop: 1,
  },
});
