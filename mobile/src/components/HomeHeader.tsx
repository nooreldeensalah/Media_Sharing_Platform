import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { getFlexDirection, isRTL } from "../utils/numberUtils";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LanguageSelector } from "./ui/LanguageSelector";
import LogoutButton from "./LogoutButton";
import { UploadIndicator } from "./ui/UploadIndicator";
import { SearchAndFilter } from "./SearchAndFilter";
import { User } from "../types";

interface HomeHeaderProps {
  onLogout: () => void;
  // Upload indicator props
  isUploading: boolean;
  uploadFileName?: string;
  uploadIsVideo: boolean;
  // Search and filter props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUser: string | null;
  onUserChange: (userId: string | null) => void;
  users: User[];
  onRefresh: () => void;
  isRefreshing: boolean;
  onUpload: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onLogout,
  isUploading,
  uploadFileName,
  uploadIsVideo,
  searchQuery,
  onSearchChange,
  selectedUser,
  onUserChange,
  users,
  onRefresh,
  isRefreshing,
  onUpload,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t, i18n } = useTranslation();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerTop,
          { flexDirection: getFlexDirection(i18n.language) },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text
            style={[
              styles.appTitle,
              {
                color: colors.text,
                textAlign: isRTL(i18n.language) ? "right" : "left",
              },
            ]}
          >
            {t("home")}
          </Text>
        </View>
        <View
          style={[
            styles.headerRight,
            { flexDirection: getFlexDirection(i18n.language) },
          ]}
        >
          <ThemeToggle />
          <LanguageSelector />
          <LogoutButton onPress={onLogout} />
        </View>
      </View>

      {/* Upload indicator */}
      <UploadIndicator
        visible={isUploading}
        fileName={uploadFileName}
        isVideo={uploadIsVideo}
      />

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedUser={selectedUser}
        onUserChange={onUserChange}
        users={users}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        onUpload={onUpload}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  headerTop: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "center",
    gap: 8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
