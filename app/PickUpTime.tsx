import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner";

const PickUpTime: React.FC = () => {
  const navigation = useNavigation();

  const today = new Date();
  const dayOptions = [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      label: i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" }),
      dateText: `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      date,
    };
  });

  const [selectedDate, setSelectedDate] = useState(dayOptions[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const slots = {
    Morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM"],
    Afternoon: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM"],
    Evening: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"],
  };

  const confirmSelection = async () => {
    if (!selectedTime) {
      toast.error("Select a time slot");
      return;
    }

    const fullDate = new Date(selectedDate.date);
    const [hourMin, period] = selectedTime.split(" ");
    const [h, m] = hourMin.split(":").map(Number);
    let hour = period === "PM" && h !== 12 ? h + 12 : h === 12 && period === "AM" ? 0 : h;

    fullDate.setHours(hour);
    fullDate.setMinutes(m);
    fullDate.setSeconds(0);

    const iso = fullDate.toISOString();
    const label = `${selectedDate.label}, ${selectedTime} - ${add30Mins(selectedTime)}`;

    await AsyncStorage.setItem("selectedPickupTime", iso);
    await AsyncStorage.setItem("selectedPickupLabel", label);
    toast.success(`Pickup time set: ${label}`);
    navigation.navigate("(tabs)/Cart");
  };

  const add30Mins = (start: string) => {
    const [time, period] = start.split(" ");
    let [h, m] = time.split(":").map(Number);
    m += 30;
    if (m >= 60) {
      h += 1;
      m -= 60;
    }
    let newPeriod = period;
    if (h === 12 && period === "AM") newPeriod = "PM";
    if (h === 12 && period === "PM") newPeriod = "AM";
    if (h > 12) h -= 12;
    return `${h}:${m.toString().padStart(2, "0")} ${newPeriod}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" /> {/* Black arrow */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pick Up Time</Text> {/* Black header title */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Date Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {dayOptions.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.datePill,
                selectedDate.label === option.label && styles.datePillSelected,
              ]}
              onPress={() => setSelectedDate(option)}
            >
              <Text
                style={[
                  styles.datePillLabel,
                  selectedDate.label === option.label && styles.datePillLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.datePillSub,
                  selectedDate.label === option.label && styles.datePillLabelSelected,
                ]}
              >
                {option.dateText}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Slots */}
        {Object.entries(slots).map(([section, times]) => (
          <View key={section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section}</Text>
            <View style={styles.grid}>
              {times.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[
                    styles.slot,
                    selectedTime === time && styles.slotSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotText,
                      selectedTime === time && styles.slotTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                  <Text style={styles.slotSub}>30 min window</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Confirm Button */}
        <Button
          onPress={confirmSelection}
          style={[
            styles.confirmButton,
            !selectedTime && styles.confirmButtonDisabled,
          ]}
          disabled={!selectedTime}
        >
          <Text style={styles.confirmButtonText}>Confirm Time Slot</Text>
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff", // White background
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: "#e5e5e5", // Light gray color for the border
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Black text
  },
  scroll: {
    padding: 20,
  },
  dateScroll: {
    marginBottom: 16,
  },
  datePill: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    alignItems: "center",
  },
  datePillSelected: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  datePillLabel: {
    fontWeight: "600",
    color: "#374151",
  },
  datePillSub: {
    fontSize: 12,
    color: "#6b7280",
  },
  datePillLabelSelected: {
    color: "#fff",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  slot: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  slotSelected: {
    backgroundColor: "#ecfdf5",
    borderColor: "#16a34a",
  },
  slotText: {
    fontWeight: "600",
    color: "#374151",
  },
  slotTextSelected: {
    color: "#16a34a",
  },
  slotSub: {
    fontSize: 12,
    color: "#6b7280",
  },
  confirmButton: {
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  confirmButtonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
});

export default PickUpTime;