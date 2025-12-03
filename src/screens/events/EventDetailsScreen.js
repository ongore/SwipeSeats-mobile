import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;

  return (
    <SafeAreaView style={styles.container}>
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
              {event.venue?.name} • {event.venue?.city}, {event.venue?.state}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              {new Date(event.datetime).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </Text>
          </View>

          {event.minPrice && (
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Starting at</Text>
              <Text style={styles.priceAmount}>${event.minPrice}</Text>
            </View>
          )}

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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 16, color: '#6b7280', marginLeft: 12, flex: 1 },
  priceCard: { backgroundColor: '#eff6ff', padding: 20, borderRadius: 12, marginVertical: 20, alignItems: 'center' },
  priceLabel: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  priceAmount: { fontSize: 36, fontWeight: 'bold', color: '#6366f1' },
  startButton: { marginTop: 20, height: 56, borderRadius: 12, overflow: 'hidden' },
  gradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  startButtonText: { fontSize: 18, fontWeight: '600', color: 'white' }
});

export default EventDetailsScreen;