import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PasswordStrength } from "../utils/passwordUtils";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

const requirements = [
  { key: "hasUpper", label: "One uppercase letter" },
  { key: "hasLower", label: "One lowercase letter" },
  { key: "hasNumber", label: "One number" },
  { key: "hasSpecial", label: "One special character" },
  { key: "hasLength", label: "At least 8 characters" },
] as const;

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  const strengthBars = Object.values(strength);

  return (
    <View style={styles.container}>
      <View style={styles.strengthBars}>
        {strengthBars.map((passed, index) => (
          <View
            key={`strength-bar-${index}`}
            style={[
              styles.strengthBar,
              { backgroundColor: passed ? "green" : "gray" },
            ]}
          />
        ))}
      </View>
      <View style={styles.requirements}>
        {requirements.map(({ key, label }) => (
          <Text
            key={key}
            style={[
              styles.requirement,
              {
                color: strength[key as keyof PasswordStrength]
                  ? "green"
                  : "gray",
              },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  strengthBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  requirements: {
    flexDirection: "column",
  },
  requirement: {
    fontSize: 12,
    marginBottom: 4,
  },
});

export default PasswordStrengthIndicator;
