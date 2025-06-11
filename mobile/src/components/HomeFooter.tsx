import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { Pagination } from "./Pagination";
import { formatNumber } from "../utils/numberUtils";

interface HomeFooterProps {
  filteredItemsLength: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({
  filteredItemsLength,
  totalPages,
  currentPage,
  onPageChange,
  itemsPerPage,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t, i18n } = useTranslation();

  if (filteredItemsLength === 0) return null;

  if (totalPages > 1) {
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={filteredItemsLength}
        itemsPerPage={itemsPerPage}
      />
    );
  }

  // Show item count even when there's only one page
  return (
    <View style={[styles.footerInfo, { backgroundColor: colors.background }]}>
      <Text style={[styles.itemCountText, { color: colors.textSecondary }]}>
        {formatNumber(filteredItemsLength, i18n.language)}{" "}
        {filteredItemsLength === 1 ? t("item") : t("items")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerInfo: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  itemCountText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
