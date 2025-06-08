import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../api";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import { checkPasswordStrength } from "../utils/passwordUtils";
import { useDebounce } from "../hooks/useDebounce";
import { NavigationProp } from "../types";

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation<NavigationProp>();

  // Debounce only for error messages to reduce UI noise
  const debouncedPassword = useDebounce(password, 300);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 300);

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

  const handleRegister = async () => {
    try {
      await registerUser(username, password);
      setError("");
      navigation.navigate("Login");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, showPasswordMismatch ? styles.inputError : null]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {showPasswordMismatch && (
        <Text style={styles.error}>Passwords do not match</Text>
      )}
      {/* Always show password strength indicator */}
      <PasswordStrengthIndicator strength={passwordStrength} />
      <Button
        title="Register"
        onPress={handleRegister}
        disabled={!isPasswordValid || !passwordsMatch || !username}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already registered? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  link: {
    color: "blue",
    marginTop: 16,
    textAlign: "center",
  },
});

export default RegisterScreen;
