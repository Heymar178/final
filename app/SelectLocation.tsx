import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Search,
  Navigation,
  ChevronRight,
  MapPin,
} from "lucide-react-native";
import { Button } from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/supabaseClient";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

const SelectLocation: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("locations").select("*");
        if (error) {
          console.error("Error fetching locations:", error);
          return;
        }
        setLocations(data || []);
      } catch (error) {
        console.error("Unexpected error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleUseCurrentLocation = async () => {
    try {
      const currentLocation = {
        id: "current",
        name: "Current Location", // Save the name instead of the address
      };
      await AsyncStorage.setItem(
        "selectedLocation",
        JSON.stringify(currentLocation)
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error saving current location:", error);
    }
  };

  const handleConfirmLocation = async () => {
    try {
      if (selectedLocationId) {
        const selectedLocation = locations.find(
          (loc) => loc.id === selectedLocationId
        );

        if (selectedLocation) {
          const locationToSave = {
            id: selectedLocation.id,
            name: selectedLocation.name, // Save only the name
          };
          await AsyncStorage.setItem(
            "selectedLocation",
            JSON.stringify(locationToSave)
          );
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error("Error confirming location:", error);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocationId(location.id);
  };

  const filteredLocations = searchQuery
    ? locations.filter((location) =>
        [location.name, location.address, location.city]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : locations;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color="#000" /> {/* Black icon */}
        </Button>
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            placeholder="Search for a location"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search for a location"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleUseCurrentLocation}
            accessibilityLabel="Use current location"
          >
            <View style={styles.locationInfo}>
              <Navigation size={20} color="#16a34a" />
              <Text style={styles.locationText}>Use current location</Text>
            </View>
            <ChevronRight size={20} color="#16a34a" />
          </TouchableOpacity>
        </View>

        {filteredLocations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCATIONS</Text>
            {filteredLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationButton,
                  selectedLocationId === location.id && styles.selectedLocation,
                ]}
                onPress={() => handleLocationSelect(location)}
                accessibilityLabel={`Select location: ${location.name}`}
              >
                <MapPin
                  size={20}
                  color={
                    selectedLocationId === location.id ? "#16a34a" : "#9ca3af"
                  }
                />
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>
                    {location.address}, {location.city}, {location.state}{" "}
                    {location.zip_code}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filteredLocations.length === 0 && !loading && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>No locations found</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
          disabled={!selectedLocationId}
          accessibilityLabel="Confirm selected location"
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  searchInputContainer: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  selectedLocation: {
    backgroundColor: "#f0fdf4",
    borderColor: "#d1fae5",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#16a34a",
  },
  locationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "500",
  },
  locationAddress: {
    fontSize: 12,
    color: "#6b7280",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  confirmButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SelectLocation;
