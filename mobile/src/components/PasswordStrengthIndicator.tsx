import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PasswordStrength } from "../utils/passwordUtils";
import { PasswordStrengthIndicatorProps } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";

interface Requirement {
  key: keyof PasswordStrength;
  labelKey: string;
  icon: string;
}

const requirements: Requirement[] = [
  {
    key: "hasLength",
    labelKey: "At least 8 characters",
    icon: "📏",
  },
  {
    key: "hasUpper",
    labelKey: "One uppercase letter (A-Z)",
    icon: "🔤",
  },
  {
    key: "hasLower",
    labelKey: "One lowercase letter (a-z)",
    icon: "🔡",
  },
  {
    key: "hasNumber",
    labelKey: "One number (0-9)",
    icon: "🔢",
  },
  {
    key: "hasSpecial",
    labelKey: "One special character (!@#$%^&*)",
    icon: "⚡",
  },
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t } = useTranslation();
  const metRequirements = Object.values(strength).filter(Boolean).length;

  const getStrengthLevel = () => {
    if (metRequirements === 0)
      return { labelKey: "passwordWeak", color: colors.error, width: 0 };
    if (metRequirements <= 2)
      return { labelKey: "passwordWeak", color: colors.error, width: 0.4 };
    if (metRequirements <= 3)
      return { labelKey: "passwordMedium", color: colors.warning, width: 0.6 };
    if (metRequirements <= 4)
      return { labelKey: "passwordStrong", color: colors.info, width: 0.8 };
    return { labelKey: "passwordVeryStrong", color: colors.success, width: 1 };
  };

  const strengthLevel = getStrengthLevel();

  return (
    <View style={styles.container}>
      <View style={styles.strengthSection}>
        <View style={styles.strengthHeader}>
          <Text style={[styles.strengthTitle, { color: colors.text }]}>
            Password Strength
          </Text>
          <Text style={[styles.strengthLabel, { color: strengthLevel.color }]}>
            {t(strengthLevel.labelKey)}
          </Text>
        </View>

        <View
          style={[
            styles.progressBarContainer,
            { backgroundColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: strengthLevel.color,
                flex: strengthLevel.width,
              },
            ]}
          />
          <View style={{ flex: 1 - strengthLevel.width }} />
        </View>
      </View>

      <View style={styles.requirementsSection}>
        <Text style={[styles.requirementsTitle, { color: colors.text }]}>
          Requirements:
        </Text>
        <View style={styles.requirementsList}>
          {requirements.map(({ key, labelKey, icon }) => {
            const isMet = strength[key];
            return (
              <View key={key} style={styles.requirementItem}>
                <View
                  style={[
                    styles.requirementIcon,
                    {
                      backgroundColor: isMet
                        ? colors.success + "20"
                        : colors.disabled,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.requirementIconText,
                      { color: isMet ? colors.success : colors.textSecondary },
                    ]}
                  >
                    {isMet ? "✓" : icon}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.requirementText,
                    {
                      color: isMet ? colors.success : colors.textSecondary,
                      textDecorationLine: isMet ? "line-through" : "none",
                    },
                  ]}
                >
                  {labelKey}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  strengthSection: {
    marginBottom: 12,
  },
  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  requirementsSection: {
    gap: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  requirementIconText: {
    fontSize: 12,
    fontWeight: "600",
  },
  requirementText: {
    fontSize: 12,
    flex: 1,
  },
});

export default PasswordStrengthIndicator;
