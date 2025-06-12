import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { getFlexDirection, isRTL } from "../utils/numberUtils";
import { useTranslation } from "react-i18next";
import { Input } from "./ui/Input";
import { User } from "../types";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUser: string | null;
  onUserChange: (userId: string | null) => void;
  users: User[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onUpload?: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedUser,
  onUserChange,
  users,
  onRefresh,
  isRefreshing = false,
  onUpload,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t, i18n } = useTranslation();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const handleUserSelect = (userId: string | null) => {
    onUserChange(userId);
    setIsFilterModalVisible(false);
  };

  const getSelectedUserName = () => {
    if (!selectedUser) return t("allUsers");
    const user = users.find((u) => u.id === selectedUser);
    return user?.email || t("allUsers");
  };

  const renderUserItem = ({ item }: { item: User | null }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          flexDirection: getFlexDirection(i18n.language),
        },
        (!selectedUser && !item) || selectedUser === item?.id
          ? { backgroundColor: colors.primary + "20" }
          : {},
      ]}
      onPress={() => handleUserSelect(item?.id || null)}
      accessibilityLabel={`Filter by ${item?.email || "all users"}`}
      accessibilityRole="button"
    >
      <View style={styles.userInfo}>
        <Text
          style={[
            styles.userName,
            {
              color: colors.text,
              textAlign: isRTL(i18n.language) ? "right" : "left",
            },
          ]}
        >
          {item?.email || t("allUsers")}
        </Text>
      </View>
      {((!selectedUser && !item) || selectedUser === item?.id) && (
        <Ionicons name="checkmark" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  const allUsersData = [null, ...users];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchRow,
            { flexDirection: getFlexDirection(i18n.language) },
          ]}
        >
          <View style={styles.searchInputContainer}>
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChangeText={onSearchChange}
              leftIcon="search"
              containerStyle={{ marginBottom: 0, flex: 1 }}
              accessibilityLabel={t("search")}
            />
          </View>
          {onUpload && (
            <TouchableOpacity
              style={[
                styles.uploadButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={onUpload}
              accessibilityLabel={t("upload")}
              accessibilityRole="button"
            >
              <Ionicons name="cloud-upload-outline" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={[
          styles.controlsContainer,
          { flexDirection: getFlexDirection(i18n.language) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setIsFilterModalVisible(true)}
          accessibilityLabel={t("filterBy")}
          accessibilityRole="button"
        >
          {/* For RTL: filter icon on left, chevron on right */}
          {isRTL(i18n.language) ? (
            <>
              <Ionicons name="filter" size={16} color={colors.text} />
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: colors.text,
                    textAlign: "right",
                  },
                ]}
              >
                {getSelectedUserName()}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.text} />
            </>
          ) : (
            <>
              <Ionicons name="filter" size={16} color={colors.text} />
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: colors.text,
                    textAlign: "left",
                  },
                ]}
              >
                {getSelectedUserName()}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.text} />
            </>
          )}
        </TouchableOpacity>

        {onRefresh && (
          <TouchableOpacity
            style={[
              styles.refreshButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={onRefresh}
            disabled={isRefreshing}
            accessibilityLabel="Refresh"
            accessibilityRole="button"
          >
            <Ionicons
              name="refresh"
              size={20}
              color={colors.text}
              style={isRefreshing ? { transform: [{ rotate: "180deg" }] } : {}}
            />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomColor: colors.border,
                  flexDirection: getFlexDirection(i18n.language),
                },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: colors.text,
                    textAlign: isRTL(i18n.language) ? "right" : "left",
                  },
                ]}
              >
                {t("filterBy")}
              </Text>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                accessibilityLabel="Close filter"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={allUsersData}
              renderItem={renderUserItem}
              keyExtractor={(item, index) => item?.id || "all-users"}
              style={styles.userList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchRow: {
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  controlsContainer: {
    gap: 12,
    alignItems: "center",
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  filterButtonText: {
    flex: 1,
    fontSize: 14,
  },
  refreshButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    maxHeight: "70%",
  },
  modalHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  userList: {
    maxHeight: 300,
  },
  userItem: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
});
