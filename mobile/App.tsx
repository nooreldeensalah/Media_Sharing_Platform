import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { ErrorBoundary } from "./src/components/ui/ErrorBoundary";
import "./src/i18n";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // Could show a splash screen here
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false, // We'll handle our own headers
              }}
            >
              {isAuthenticated ? (
                <Stack.Screen name="Home">
                  {(props) => (
                    <HomeScreen
                      {...props}
                      setIsAuthenticated={setIsAuthenticated}
                    />
                  )}
                </Stack.Screen>
              ) : (
                <>
                  <Stack.Screen name="Login">
                    {(props) => (
                      <LoginScreen
                        {...props}
                        setIsAuthenticated={setIsAuthenticated}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
