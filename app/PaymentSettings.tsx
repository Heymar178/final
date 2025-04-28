import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, CreditCard, Trash2 } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NavigationBar from "@/components/NavigationBar";
import { supabase } from "@/supabaseClient";
import SHA256 from "crypto-js/sha256";

const getCardType = (number: string): string => {
  const cleaned = number.replace(/\D/g, "");
  if (/^4/.test(cleaned)) return "Visa";
  if (/^5[1-5]/.test(cleaned)) return "MasterCard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^6(?:011|5)/.test(cleaned)) return "Discover";
  if (/^35(2[89]|[3-8][0-9])/.test(cleaned)) return "JCB";
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return "Diners Club";
  return "Unknown";
};

const PaymentSettings: React.FC = () => {
  const navigation = useNavigation();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    firstName: "",
    lastName: "",
  });

  const fetchPayments = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No active user:", userError);
        setPayments([]);
        return;
      }

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
      } else {
        setPayments(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    if (name === "cardNumber") {
      // Allow only numeric input for the card number
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setCardDetails((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setCardDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    const cardType = getCardType(cardDetails.cardNumber);
    const cardHash = SHA256(cardDetails.cardNumber).toString();
    const last4 = cardDetails.cardNumber.slice(-4);

    const { error } = await supabase.from("payments").insert([
      {
        user_id: user.id,
        card_type: cardType,
        card_number: cardHash,
        card_last4: last4,
        expiration_date: cardDetails.expirationDate,
        cardholder_name: `${cardDetails.firstName} ${cardDetails.lastName}`,
      },
    ]);

    if (error) {
      console.error("Error saving card:", error);
      toast.error("Failed to save card.");
      return;
    }

    toast.success("Card saved successfully!");
    setCardDetails({
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      firstName: "",
      lastName: "",
    });
    fetchPayments();
  };

  const handleDeleteCard = async (id: string) => {
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting card.");
    } else {
      toast.success("Card deleted.");
      setPayments((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Loading saved cards...</Text>;
  }

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
        <Text style={styles.headerTitle}>Payment Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CreditCard size={24} color="#000" style={styles.sectionIcon} />{" "}
              {/* Black icon */}
              <Text style={styles.sectionTitle}>Add New Card</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChangeText={(text) => handleInputChange("cardNumber", text)}
              keyboardType="numeric"
              placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flex]}
                placeholder="MM/YY"
                value={cardDetails.expirationDate}
                onChangeText={(text) =>
                  handleInputChange("expirationDate", text)
                }
                keyboardType="numeric"
                placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
              />
              <TextInput
                style={[styles.input, styles.flex]}
                placeholder="CVV"
                value={cardDetails.cvv}
                onChangeText={(text) => handleInputChange("cvv", text)}
                keyboardType="numeric"
                placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={cardDetails.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={cardDetails.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              placeholderTextColor="rgba(0, 0, 0, 0.5)" // Transparent black placeholder
            />
          </View>

          {payments.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Cards</Text>
              {payments.map((card) => (
                <View key={card.id} style={styles.savedCard}>
                  <View style={styles.savedCardInfo}>
                    <View style={styles.cardType}>
                      <Text style={styles.cardTypeText}>
                        {card.card_type?.toUpperCase() || "UNKNOWN"}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.cardLastFour}>
                        •••• •••• •••• {card.card_last4}
                      </Text>
                      <Text style={styles.cardExpiration}>
                        Expires {card.expiration_date}
                      </Text>
                      <Text style={styles.cardholderName}>
                        {card.cardholder_name}
                      </Text>
                    </View>
                  </View>
                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noCardsText}>No cards saved yet.</Text>
          )}
          <Button style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Card</Text>
          </Button>
        </View>
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  backButton: { marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  scrollContainer: { flexGrow: 1, paddingBottom: 80 },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: { marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  flex: { flex: 1, marginRight: 8 },
  savedCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  savedCardInfo: { flexDirection: "row", alignItems: "center" },
  cardType: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  cardTypeText: { fontSize: 10, fontWeight: "bold", color: "#fff" },
  cardLastFour: { fontSize: 14, fontWeight: "500" },
  cardExpiration: { fontSize: 12, color: "#6b7280" },
  cardholderName: { fontSize: 12, color: "#374151" },
  saveButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  noCardsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 6,
    marginBottom: 24,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 30,
  },
});

export default PaymentSettings;