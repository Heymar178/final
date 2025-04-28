import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CreditCard, Trash2, Info } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import NavigationBar from '@/components/NavigationBar';
import { supabase } from '@/supabaseClient';

const CustomerInfo: React.FC = () => {
  const navigation = useNavigation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    firstName: '',
    lastName: '',
    saveCard: false,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const user = supabase.auth.user();

      if (!user) {
        toast.error('User not logged in.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('payments')
        .select('id, user_id, card_last4, expiration_date, cardholder_name, created_at, card_type, card_number')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to fetch payment details.');
      } else {
        setPayments(data || []);
      }

      setLoading(false);
    };

    fetchPayments();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCardDetails((prev) => ({
      ...prev,
      saveCard: checked,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if (!cardDetails.saveCard) {
        toast.info('Card details will not be saved as "Save card for future payments" is not selected.');
        return;
      }

      const user = supabase.auth.user();
      if (!user) {
        toast.error('User not logged in.');
        return;
      }

      const { error } = await supabase.from('payments').insert([
        {
          user_id: user.id,
          card_type: 'visa', // Replace with logic to determine card type
          card_last4: cardDetails.cardNumber.slice(-4),
          expiration_date: cardDetails.expirationDate,
          cardholder_name: `${cardDetails.firstName} ${cardDetails.lastName}`,
          card_number: cardDetails.cardNumber,
        },
      ]);

      if (error) {
        console.error('Error saving card:', error);
        toast.error('Failed to save card.');
        return;
      }

      toast.success('Payment details saved successfully!');
      navigation.navigate('Account');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase.from('payments').delete().eq('id', cardId);

      if (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete card.');
        return;
      }

      toast.success('Card removed successfully');
      setPayments((prev) => prev.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
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
          <ArrowLeft size={24} />
        </Button>
        <Text style={styles.headerTitle}>Customer Info</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CreditCard size={24} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Card Details</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                value={cardDetails.cardNumber}
                onChangeText={(text) => handleInputChange('cardNumber', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex]}>
                <Text style={styles.label}>Expiration Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={cardDetails.expirationDate}
                  onChangeText={(text) => handleInputChange('expirationDate', text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, styles.flex]}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>CVV</Text>
                  <Info size={16} color="#9ca3af" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="000"
                  value={cardDetails.cvv}
                  onChangeText={(text) => handleInputChange('cvv', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={cardDetails.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={cardDetails.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                checked={cardDetails.saveCard}
                onChange={handleCheckboxChange}
              />
              <Text style={styles.checkboxLabel}>Save card for future payments</Text>
            </View>
          </View>

          {payments.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Cards</Text>
              {payments.map((card) => (
                <View key={card.id} style={styles.savedCard}>
                  <View style={styles.savedCardInfo}>
                    <View style={styles.cardType}>
                      <Text style={styles.cardTypeText}>{card.card_type.toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardLastFour}>•••• {card.card_last4}</Text>
                      <Text style={styles.cardExpiration}>
                        Expires {card.expiration_date}
                      </Text>
                      <Text style={styles.cardholderName}>
                        Cardholder: {card.cardholder_name}
                      </Text>
                      <Text style={styles.createdAt}>
                        Added on: {new Date(card.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Button
                    variant="ghost"
                    size="icon"
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noCardsText}>No Saved Cards Available</Text>
          )}

          <Button style={styles.saveButton} onPress={handleSaveChanges}>
            Save Changes
          </Button>
        </View>
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
    marginRight: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  savedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  savedCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    backgroundColor: '#2563eb',
    padding: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  cardTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardLastFour: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardExpiration: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardholderName: {
    fontSize: 12,
    color: '#374151',
  },
  createdAt: {
    fontSize: 12,
    color: '#6b7280',
  },
  deleteButton: {
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  noCardsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
  },
});

export default CustomerInfo;