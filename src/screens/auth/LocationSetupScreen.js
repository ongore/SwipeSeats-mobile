// src/screens/auth/LocationSetupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationSetupScreen = ({ navigation }) => {
  const [location, setLocation] = useState('');

  const popularCities = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
  ];

  const handleContinue = () => {
    // In a real app, you'd save the location
    // For now, just navigate to main app
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Set your location</Text>
          <Text style={styles.subtitle}>
            We'll show you events happening near you
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#9ca3af" />
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>Popular cities</Text>
          <View style={styles.citiesGrid}>
            {popularCities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityChip,
                  location === city && styles.cityChipSelected,
                ]}
                onPress={() => setLocation(city)}
              >
                <Text
                  style={[
                    styles.cityChipText,
                    location === city && styles.cityChipTextSelected,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !location && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!location}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleContinue}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  suggestions: {
    marginBottom: 40,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cityChipSelected: {
    backgroundColor: '#6366f1',
  },
  cityChipText: {
    fontSize: 14,
    color: '#374151',
  },
  cityChipTextSelected: {
    color: '#ffffff',
  },
  continueButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#c7d2fe',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

export default LocationSetupScreen;

