import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6']}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="ticket" size={80} color="white" />
          <Text style={styles.title}>SwipeSeats</Text>
          <Text style={styles.subtitle}>
            Swipe right to find your perfect seat
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between', padding: 20 },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 48, fontWeight: 'bold', color: 'white', marginTop: 24, marginBottom: 12 },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', paddingHorizontal: 40 },
  actions: { gap: 12, marginBottom: 40 },
  primaryButton: { backgroundColor: 'white', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { fontSize: 18, fontWeight: '600', color: '#6366f1' },
  secondaryButton: { height: 56, borderRadius: 12, borderWidth: 2, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { fontSize: 18, fontWeight: '600', color: 'white' }
});