import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

type UserRole = "customer" | "agent" | "technician" | null;

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>(null); // No default role
  const [loading, setLoading] = useState(false);

  const navigateToDashboard = useCallback((userRole: UserRole) => {
    if (!userRole) return;
    switch (userRole) {
      case "customer":
        router.replace("/(tabs)");
        break;
      case "agent":
        router.replace("/agent/agentdashboard");
        break;
      case "technician":
        router.replace("/technician/techniciandashboard");
        break;
    }
  }, [router]);

  const handleLogin = useCallback(async () => {
    setLoading(true);

    try {
      // Simulate API call - replace with actual authentication logic if needed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store user data (role only, since no email/password)
      await AsyncStorage.setItem("@auth_token", "dummy_auth_token");
      await AsyncStorage.setItem("@user_role", role || '');

      // Navigate based on role
      navigateToDashboard(role);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [role, navigateToDashboard]);

  const handleSignOut = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Success", "Signed out successfully.");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={["#F8FBFF", "#F8FBFF", "#09ae48ff"]}
        style={styles.gradientBackground}
      >
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#1a237e" />
          <Text style={styles.loadingText}>Signing in...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#ffffffff", "#F8FBFF", "#F8FBFF","#F8FBFF","#F8FBFF", "#ffffffff"]}
      style={styles.gradientBackground}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <Text style={styles.title}>TelkomX Login</Text>

        <Text style={styles.subtitle}>Select your role to sign in</Text>

        <View style={styles.roleSelector}>
          {["customer", "agent", "technician"].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleButton, role === r && styles.roleButtonActive]}
              onPress={() => setRole(r as UserRole)}
              accessibilityLabel={`Select ${r} role`}
              accessibilityRole="button"
            >
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.loginButton, ( !role) && { backgroundColor: "#9fa8da" }]}
          onPress={handleLogin}
          disabled={loading || !role}
          accessibilityLabel="Login button"
          accessibilityRole="button"
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>


      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0033a0",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#0033a0",
    borderRadius: 8,
    marginHorizontal: 6,
  },
  roleButtonActive: {
    backgroundColor: "#0033a0",
  },
  roleText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0033a0",
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#0033a0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  signOutButton: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  signOutButtonText: {
    color: "#D32F2F",
    fontWeight: "600",
    fontSize: 14,
  },
});