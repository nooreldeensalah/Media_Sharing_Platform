import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import {
  formatNumber,
  formatNumberRange,
  getFlexDirection,
  getPreviousChevron,
  getNextChevron,
} from "../utils/numberUtils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t, i18n } = useTranslation();

  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const renderPageButton = (page: number) => {
    const isActive = page === currentPage;

    return (
      <TouchableOpacity
        key={page}
        style={[
          styles.pageButton,
          {
            backgroundColor: isActive ? colors.primary : colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => onPageChange(page)}
        accessibilityLabel={t("goToPage", {
          page: formatNumber(page, i18n.language),
        })}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <Text
          style={[
            styles.pageButtonText,
            {
              color: isActive ? colors.primaryText : colors.text,
            },
          ]}
        >
          {formatNumber(page, i18n.language)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {totalItems && itemsPerPage && (
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          {(() => {
            const { start, end, total } = formatNumberRange(
              Math.min((currentPage - 1) * itemsPerPage + 1, totalItems),
              Math.min(currentPage * itemsPerPage, totalItems),
              totalItems,
              i18n.language,
            );
            return t("showingItems", { start, end, total });
          })()}
        </Text>
      )}

      <View
        style={[
          styles.controls,
          { flexDirection: getFlexDirection(i18n.language) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: canGoPrevious ? 1 : 0.5,
            },
          ]}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          accessibilityLabel={t("previousPage")}
          accessibilityRole="button"
        >
          <Ionicons
            name={getPreviousChevron(i18n.language)}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.pages,
            { flexDirection: getFlexDirection(i18n.language) },
          ]}
        >
          {visiblePages[0] > 1 && (
            <>
              {renderPageButton(1)}
              {visiblePages[0] > 2 && (
                <Text
                  style={[styles.ellipsis, { color: colors.textSecondary }]}
                >
                  ...
                </Text>
              )}
            </>
          )}
          {visiblePages.map(renderPageButton)}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <Text
                  style={[styles.ellipsis, { color: colors.textSecondary }]}
                >
                  ...
                </Text>
              )}
              {renderPageButton(totalPages)}
            </>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: canGoNext ? 1 : 0.5,
            },
          ]}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          accessibilityLabel={t("nextPage")}
          accessibilityRole="button"
        >
          <Ionicons
            name={getNextChevron(i18n.language)}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  info: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pages: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pageButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  ellipsis: {
    fontSize: 16,
    paddingHorizontal: 8,
  },
});
