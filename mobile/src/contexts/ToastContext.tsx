import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import { getColors } from "../constants/Colors";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration || 4000,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    },
    [hideToast],
  );

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "success", title, message });
    },
    [showToast],
  );

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "error", title, message });
    },
    [showToast],
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "warning", title, message });
    },
    [showToast],
  );

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "info", title, message });
    },
    [showToast],
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        hideToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animation]);

  const handleDismiss = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss(toast.id);
    });
  };

  const getToastStyle = () => {
    const baseStyle = {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    };

    switch (toast.type) {
      case "success":
        return {
          ...baseStyle,
          borderLeftWidth: 4,
          borderLeftColor: colors.success,
        };
      case "error":
        return {
          ...baseStyle,
          borderLeftWidth: 4,
          borderLeftColor: colors.error,
        };
      case "warning":
        return {
          ...baseStyle,
          borderLeftWidth: 4,
          borderLeftColor: colors.warning,
        };
      case "info":
        return {
          ...baseStyle,
          borderLeftWidth: 4,
          borderLeftColor: colors.info,
        };
      default:
        return baseStyle;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
        return "information-circle";
      default:
        return "information-circle";
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      case "warning":
        return colors.warning;
      case "info":
        return colors.info;
      default:
        return colors.text;
    }
  };

  const toastStyle = getToastStyle();
  const iconColor = getIconColor();

  return (
    <Animated.View
      style={[
        styles.toast,
        toastStyle,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.toastContent}>
        <Ionicons
          name={getIcon()}
          size={24}
          color={iconColor}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {toast.title}
          </Text>
          {toast.message && (
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {toast.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.dismissButton}
          accessibilityLabel="Dismiss notification"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.8,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
    marginTop: -2,
  },
});
