import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/Logo";
import SocialButton from "@/components/SocialButton";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to log in");
        setLoading(false);
        return;
      }

      // Fetch the user's information from the `users` table
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        toast.error("Failed to fetch user session.");
        setLoading(false);
        return;
      }

      const { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("role") // Fetch only the role
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        toast.error("Failed to fetch user information.");
        setLoading(false);
        return;
      }

      if (!userInfo || !userInfo.role) {
        toast.error("User role not found. Please contact support.");
        setLoading(false);
        return;
      }

      // Redirect based on the user's role
      if (userInfo.role === "Employee") {
        toast.success("Welcome, Employee!");
        navigation.navigate("EmployeeView"); // Redirect to EmployeeView
      } else if (userInfo.role === "Customer") {
        toast.success("Welcome, Customer!");
        navigation.navigate("(tabs)/index"); // Redirect to index
      } else {
        toast.error("Invalid role. Please contact support.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "apple") => {
    toast.success(`Social login with ${provider} initiated`);
    navigation.navigate("(tabs)/index");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Logo />

          <View style={styles.socialButtons}>
            <SocialButton
              provider="google"
              onPress={() => handleSocialLogin("google")}
              style={styles.fullWidth}
            />
            <SocialButton
              provider="apple"
              onPress={() => handleSocialLogin("apple")}
              style={styles.fullWidth}
            />
          </View>

          <View style={[styles.separatorContainer, styles.fullWidth]}>
            <View style={styles.separator} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.form}>
            <View style={[styles.inputGroup, styles.fullWidth]}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputGroup, styles.fullWidth]}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Button
              style={[styles.submitButton, styles.fullWidth]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </Button>
          </View>

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pagination}>
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  innerContainer: {
    alignItems: "center",
  },
  fullWidth: {
    width: 240,
    alignSelf: "center",
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
  },
  socialButtons: {
    alignItems: "center",
    gap: 12,
    marginTop: 32,
    marginBottom: 24,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center-align the content
    marginVertical: 16,
  },
  separator: {
    flex: 1, // Make the separators take equal space
    height: 1.25,
    backgroundColor: "#e5e5e5",
  },
  separatorText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center", // Center-align the text
  },
  form: {
    alignItems: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  footerTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkText: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16a34a",
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e5e5e5",
    marginHorizontal: 4,
  },
});

export default Login;