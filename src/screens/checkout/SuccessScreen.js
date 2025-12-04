import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SuccessScreen({ navigation, route }) {
  const { event, listing } = route.params || {};

  const handleDone = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.iconContainer}
        >
          <Ionicons name="checkmark-circle" size={80} color="white" />
        </LinearGradient>

        <Text style={styles.title}>Purchase Complete!</Text>
        <Text style={styles.subtitle}>
          Your tickets have been purchased through SeatGeek
        </Text>

        {event && (
          <View style={styles.detailsCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            {listing && (
              <>
                <Text style={styles.detailText}>
                  Section {listing.section} • Row {listing.row}
                </Text>
                <Text style={styles.detailText}>
                  {listing.quantity} tickets
                </Text>
              </>
            )}
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="mail-outline" size={24} color="#6366f1" />
          <Text style={styles.infoText}>
            Check your email for ticket confirmation and details
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 32, paddingHorizontal: 20 },
  detailsCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '100%', marginBottom: 16 },
  eventTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12, textAlign: 'center' },
  detailText: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 4 },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, width: '100%' },
  infoText: { flex: 1, fontSize: 14, color: '#1e40af', marginLeft: 12, lineHeight: 20 },
  buttonContainer: { padding: 20 },
  doneButton: { backgroundColor: '#6366f1', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  doneButtonText: { fontSize: 18, fontWeight: '600', color: 'white' }
});