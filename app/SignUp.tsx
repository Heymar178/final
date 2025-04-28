import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/Logo";
import SocialButton from "@/components/SocialButton";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
  
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }
  
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "customer",
          },
        },
      });
  
      if (signUpError) {
        toast.error(signUpError.message || "Failed to create account");
        return;
      }
  
      let userId = signUpData.user?.id;
  
      if (!signUpData.session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (signInError || !signInData.user) {
          toast.error("Auto sign-in failed. Please try logging in.");
          return;
        }
  
        userId = signInData.user.id;
      }
  
      const { error: userError } = await supabase.from("users").insert([
        {
          id: userId,
          email,
          name, // <-- add name here too
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
  
      if (userError) {
        toast.error("Failed to save user details");
        return;
      }
  
      toast.success("Account created and signed in successfully!");
      navigation.navigate("(tabs)/index");
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };
  

  const handleSocialSignUp = (provider: "google" | "apple") => {
    toast.success(`Social signup with ${provider} initiated`);
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
              onPress={() => handleSocialSignUp("google")}
              style={styles.fixedWidth}
            />
            <SocialButton
              provider="apple"
              onPress={() => handleSocialSignUp("apple")}
              style={styles.fixedWidth}
            />
          </View>

          <View style={[styles.separatorContainer, styles.fixedWidth]}>
            <View style={styles.separator} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.form}>
            <View style={[styles.inputGroup, styles.fixedWidth]}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.inputGroup, styles.fixedWidth]}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputGroup, styles.fixedWidth]}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Button
              style={[styles.submitButton, styles.fixedWidth]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Sign Up</Text>
            </Button>
          </View>

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pagination}>
            <View style={styles.inactiveDot} />
            <View style={styles.activeDot} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", paddingBottom: 80 },
  innerContainer: { alignItems: "center" },
  fixedWidth: { width: 240, alignSelf: "center" },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  socialButtons: {
    gap: 12,
    marginTop: 32,
    marginBottom: 24,
    alignItems: "center",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  separator: {
    flex: 1,
    height: 1.25,
    backgroundColor: "#e5e5e5",
  },
  separatorText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  form: { alignItems: "center" },
  inputGroup: { marginBottom: 16 },
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
  footerText: { fontSize: 14, color: "#6b7280" },
  linkText: { color: "#16a34a", fontWeight: "bold" },
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

export default SignUp;
