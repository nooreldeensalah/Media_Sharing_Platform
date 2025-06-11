import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "../api";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import { checkPasswordStrength } from "../utils/passwordUtils";
import { useDebounce } from "../hooks/useDebounce";
import { NavigationProp } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { useToast } from "../contexts/ToastContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { LanguageSelector } from "../components/ui/LanguageSelector";

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation<NavigationProp>();
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { t } = useTranslation();
  const toast = useToast();

  // Longer debounce for password fields to prevent premature error messages
  const debouncedPassword = useDebounce(password, 800);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 800);

  // Password strength indicator updates immediately for better UX
  const passwordStrength = checkPasswordStrength(password);
  const isPasswordValid =
    password && Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== "";

  // Show password mismatch error only after debouncing and if user has typed in both fields
  const showPasswordMismatch =
    debouncedConfirmPassword &&
    debouncedPassword &&
    debouncedPassword !== debouncedConfirmPassword;

  const canSubmit = email && isPasswordValid && passwordsMatch && !isLoading;

  const handleRegister = async () => {
    if (!canSubmit) return;

    try {
      setIsLoading(true);
      setError("");
      await registerUser(email, password);
      toast.success(t("success"), t("accountCreatedSuccessfully"));
      navigation.navigate("Login");
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast.error(t("error"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with theme and language controls */}
          <View style={styles.header}>
            <ThemeToggle />
            <LanguageSelector />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("registerTitle")}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t("registerSubtitle")}
            </Text>

            <View style={styles.form}>
              <Input
                label={t("email")}
                placeholder={t("emailPlaceholder")}
                value={email}
                onChangeText={setEmail}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
                error={error && !email ? "Email is required" : undefined}
                required
              />

              <Input
                label={t("password")}
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChangeText={setPassword}
                leftIcon="lock-closed"
                secureTextEntry
                showPasswordToggle
                error={error && !password ? "Password is required" : undefined}
                required
              />

              <Input
                label={t("confirmPassword")}
                placeholder={t("confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon="lock-closed"
                secureTextEntry
                showPasswordToggle
                error={
                  showPasswordMismatch ? "Passwords do not match" : undefined
                }
                required
              />

              {/* Always show password strength indicator */}
              {password && (
                <PasswordStrengthIndicator strength={passwordStrength} />
              )}

              {error && (
                <Text style={[styles.error, { color: colors.error }]}>
                  {error}
                </Text>
              )}

              <Button
                onPress={handleRegister}
                loading={isLoading}
                disabled={!canSubmit}
                style={styles.registerButton}
              >
                {t("registerButton")}
              </Button>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.loginLink}
              accessibilityLabel="Go to login screen"
              accessibilityRole="button"
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>
                {t("alreadyHaveAccount")} {t("loginButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 8,
  },
  error: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  loginLink: {
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default RegisterScreen;
