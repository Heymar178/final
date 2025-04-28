import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Search,
  Package,
  CreditCard,
  ChevronRight,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavigationBar from "@/components/NavigationBar";

interface QuickHelpItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface FAQItem {
  id: string;
  question: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HelpCenter: React.FC = () => {
  const navigation = useNavigation();

  const quickHelpItems: QuickHelpItem[] = [
    {
      id: "orders",
      title: "Order Issues",
      description: "Track or cancel orders",
      icon: <Package size={24} color="#16a34a" />,
      bgColor: "#ECFDF5",
    },
    {
      id: "payment",
      title: "Payment",
      description: "Payment methods & refunds",
      icon: <CreditCard size={24} color="#2563eb" />,
      bgColor: "#EFF6FF",
    },
  ];

  const faqItems: FAQItem[] = [
    { id: "track", question: "How to track my order?" },
    { id: "delivery", question: "Delivery time & charges" },
    { id: "returns", question: "Return & refund policy" },
  ];

  const supportOptions: SupportOption[] = [
    {
      id: "chat",
      title: "Chat with us",
      description: "Available 24/7",
      icon: <MessageCircle size={24} color="#16a34a" />,
    },
    {
      id: "email",
      title: "Email support",
      description: "Response within 24 hours",
      icon: <Mail size={24} color="#2563eb" />,
    },
    {
      id: "call",
      title: "Call us",
      description: "Mon-Sat, 9AM-6PM",
      icon: <Phone size={24} color="#7c3aed" />,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="icon"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" /> {/* Black icon */}
        </Button>
        <Text style={styles.headerTitle}>Help Center</Text>
        <Button variant="ghost" size="icon">
          <Search size={22} />
        </Button>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search for help"
              style={styles.searchInput}
            />
            <Search size={18} color="#9ca3af" style={styles.searchIcon} />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Quick Help</Text>
            <View style={styles.quickHelpGrid}>
              {quickHelpItems.map((item) => (
                <Card
                  key={item.id}
                  style={[styles.card, { backgroundColor: item.bgColor }]}
                >
                  <CardContent style={styles.cardContent}>
                    <View style={styles.cardIcon}>{item.icon}</View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>
                      {item.description}
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
              {faqItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Contact Support</Text>
            <View style={styles.supportList}>
              {supportOptions.map((option) => (
                <View key={option.id} style={styles.supportItem}>
                  <View style={styles.supportIcon}>{option.icon}</View>
                  <View>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportDescription}>
                      {option.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
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
    paddingBottom: 80, // Prevent overlap with the navigation bar
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  searchContainer: {
    position: "relative",
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
  },
  searchIcon: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  quickHelpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
  faqList: {
    marginBottom: 24,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "500",
  },
  supportList: {
    marginBottom: 24,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 8,
  },
  supportIcon: {
    marginRight: 16,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  supportDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default HelpCenter;
