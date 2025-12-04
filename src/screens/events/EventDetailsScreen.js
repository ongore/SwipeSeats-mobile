import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <Image
          source={{ uri: event.imageUrl || 'https://via.placeholder.com/400x300' }}
          style={styles.image}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              {event.venue?.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              {event.venue?.city}, {event.venue?.state}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              {formatDate(event.datetime)}
            </Text>
          </View>

          {event.performers && event.performers.length > 0 && (
            <View style={styles.performersSection}>
              <Text style={styles.sectionTitle}>Performers</Text>
              {event.performers.map((performer, index) => (
                <Text key={index} style={styles.performerText}>• {performer}</Text>
              ))}
            </View>
          )}

          {event.minPrice && (
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Starting at</Text>
              <Text style={styles.priceAmount}>${event.minPrice}</Text>
              {event.maxPrice && (
                <Text style={styles.priceRange}>Up to ${event.maxPrice}</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Swipe', { event })}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.startButtonText}>Start Swiping</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  image: { width: '100%', height: 300, backgroundColor: '#e5e7eb' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 16, color: '#6b7280', marginLeft: 12, flex: 1 },
  performersSection: { marginTop: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  performerText: { fontSize: 16, color: '#6b7280', marginBottom: 4 },
  priceCard: { backgroundColor: '#eff6ff', padding: 20, borderRadius: 12, marginVertical: 20, alignItems: 'center' },
  priceLabel: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  priceAmount: { fontSize: 36, fontWeight: 'bold', color: '#6366f1' },
  priceRange: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  buttonContainer: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  startButton: { height: 56, borderRadius: 12, overflow: 'hidden' },
  gradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  startButtonText: { fontSize: 18, fontWeight: '600', color: 'white' }
});