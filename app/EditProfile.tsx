import React, { useState, useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Camera } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationBar from "@/components/NavigationBar";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";

type RootStackParamList = {
  Account: undefined;
};

const EditProfile: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Helper function to format phone numbers with dashes
  const formatPhoneNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, "").slice(0, 10); // Remove non-numeric characters
    if (numericValue.length > 6) {
      return `${numericValue.slice(0, 3)}-${numericValue.slice(
        3,
        6
      )}-${numericValue.slice(6)}`;
    } else if (numericValue.length > 3) {
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    }
    return numericValue;
  };

  const fetchUserInfo = async () => {
    setLoading(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("No session:", authError);
      toast.error("Unable to get session.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Could not load profile.");
    } else {
      setUserData(data);
      setFormData({
        fullName: data.name || "",
        email: data.email || "",
        phone: formatPhoneNumber(data.phone_number || ""), // Format phone number
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleChange = (name: string, value: string) => {
    if (name === "phone") {
      const formattedValue = formatPhoneNumber(value); // Format phone number dynamically
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!userData?.id) {
      toast.error("User ID is missing. Please try again.");
      return;
    }

    const trimmedFullName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const strippedPhone = trimmedPhone.replace(/-/g, ""); // Remove dashes for storage

    const changes: Record<string, any> = {};
    if (trimmedFullName !== userData.name) changes.name = trimmedFullName;
    if (trimmedEmail !== userData.email) changes.email = trimmedEmail;
    if (strippedPhone !== (userData.phone_number || ""))
      changes.phone_number = strippedPhone;

    if (Object.keys(changes).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .update(changes)
        .eq("id", userData.id)
        .select();

      if (error) {
        console.error("Update error:", error);
        toast.error("Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
      navigation.navigate("Account");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error updating profile.");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#16a34a" style={styles.loading} />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Button
            variant="ghost"
            size="icon"
            style={styles.backButton}
            onPress={() => navigation.navigate("Account")}
          >
            <ArrowLeft size={24} color="#000" /> {/* Black icon */}
          </Button>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Avatar style={styles.avatar}>
              <AvatarImage
                source={{
                  uri: userData?.avatar_url || "https://via.placeholder.com/96",
                }}
              />
              <AvatarFallback>
                {userData?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="default"
              size="icon"
              style={styles.cameraButton}
              onPress={() =>
                toast.info("Change profile picture feature coming soon")
              }
            >
              <Camera size={16} color="#fff" /> {/* White icon */}
            </Button>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) => handleChange("fullName", text)}
                placeholder="Enter your full name"
                placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Enter your email"
                placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder="Enter your phone number"
                placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
                keyboardType="phone-pad"
              />
            </View>

            <Button style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Button>
          </View>
        </View>
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    height: 96,
    width: 96,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#687076",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfile;
