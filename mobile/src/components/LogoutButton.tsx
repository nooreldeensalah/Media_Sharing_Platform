// src/components/LogoutButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface LogoutButtonProps {
  onPress: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LogoutButton;
