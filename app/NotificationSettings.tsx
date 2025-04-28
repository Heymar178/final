import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NavigationBar from "@/components/NavigationBar";
import { supabase } from "@/supabaseClient";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationSettings: React.FC = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData?.session) {
        console.error("No active session:", sessionError);
        navigation.navigate("Login");
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: notificationData, error: notifError } = await supabase
        .from("notifications")
        .select("push_notifications, order_updates, promotions")
        .eq("user_id", userId)
        .single();

      if (notifError) {
        console.error("Error fetching notification settings:", notifError);
        toast.error("Failed to load settings");
      } else {
        const settings: NotificationSetting[] = [
          {
            id: "push_notifications",
            title: "Push Notifications",
            description: "Receive alerts about orders and deals",
            enabled: notificationData?.push_notifications || false,
          },
          {
            id: "order_updates",
            title: "Order Updates",
            description: "Status changes and delivery updates",
            enabled: notificationData?.order_updates || false,
          },
          {
            id: "promotions",
            title: "Promotions",
            description: "Deals, discounts, and special offers",
            enabled: notificationData?.promotions || false,
          },
        ];

        setSettings(settings);
      }

      setLoading(false);
    };

    fetchNotificationSettings();
  }, []);

  const handleToggle = async (id: string) => {
    const setting = settings.find((s) => s.id === id);
    if (!setting) return;

    const updatedEnabled = !setting.enabled;

    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: updatedEnabled } : s))
    );

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .update({ [id]: updatedEnabled })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating setting:", error);
      toast.error(`Failed to update ${setting.title}`);

      // revert UI if update fails
      setSettings((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !updatedEnabled } : s))
      );
    } else {
      toast.success(
        `${setting.title} ${updatedEnabled ? "enabled" : "disabled"}`
      );
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="icon"
          style={styles.backButton}
          onPress={() => navigation.navigate("Account")}
        >
          <ArrowLeft size={24} color="#000" /> {/* Black icon */}
        </Button>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>
                  {setting.description}
                </Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => handleToggle(setting.id)}
                trackColor={{ false: "#d1d5db", true: "#10b981" }}
                thumbColor={setting.enabled ? "#ffffff" : "#9ca3af"}
              />
            </View>
          ))}
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  content: {
    padding: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default NotificationSettings;
