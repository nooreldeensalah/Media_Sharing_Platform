import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PasswordStrength } from "../utils/passwordUtils";
import { PasswordStrengthIndicatorProps } from "../types";

interface Requirement {
  key: keyof PasswordStrength;
  label: string;
  icon: string;
}

const requirements: Requirement[] = [
  { key: "hasLength", label: "At least 8 characters", icon: "📏" },
  { key: "hasUpper", label: "One uppercase letter (A-Z)", icon: "🔤" },
  { key: "hasLower", label: "One lowercase letter (a-z)", icon: "🔡" },
  { key: "hasNumber", label: "One number (0-9)", icon: "🔢" },
  { key: "hasSpecial", label: "One special character (!@#$%^&*)", icon: "⚡" },
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  const metRequirements = Object.values(strength).filter(Boolean).length;

  const getStrengthLevel = () => {
    if (metRequirements === 0)
      return { label: "Very Weak", color: "#ef4444", width: 0 };
    if (metRequirements <= 2)
      return { label: "Weak", color: "#f87171", width: 0.4 };
    if (metRequirements <= 3)
      return { label: "Fair", color: "#fbbf24", width: 0.6 };
    if (metRequirements <= 4)
      return { label: "Good", color: "#3b82f6", width: 0.8 };
    return { label: "Strong", color: "#22c55e", width: 1 };
  };

  const strengthLevel = getStrengthLevel();

  return (
    <View style={styles.container}>
      <View style={styles.strengthSection}>
        <View style={styles.strengthHeader}>
          <Text style={styles.strengthTitle}>Password Strength</Text>
          <Text style={[styles.strengthLabel, { color: strengthLevel.color }]}>
            {strengthLevel.label}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
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
        <Text style={styles.requirementsTitle}>Requirements:</Text>
        <View style={styles.requirementsList}>
          {requirements.map(({ key, label, icon }) => {
            const isMet = strength[key];
            return (
              <View key={key} style={styles.requirementItem}>
                <View
                  style={[
                    styles.requirementIcon,
                    {
                      backgroundColor: isMet ? "#dcfce7" : "#f3f4f6",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.requirementIconText,
                      { color: isMet ? "#22c55e" : "#9ca3af" },
                    ]}
                  >
                    {isMet ? "✓" : icon}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.requirementText,
                    {
                      color: isMet ? "#22c55e" : "#6b7280",
                      textDecorationLine: isMet ? "line-through" : "none",
                    },
                  ]}
                >
                  {label}
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
    color: "#374151",
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
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
    color: "#374151",
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
