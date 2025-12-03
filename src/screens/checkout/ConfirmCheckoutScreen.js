// src/screens/checkout/ConfirmCheckoutScreen.js
// Confirmation screen before proceeding to partner checkout

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import analytics from '../../utils/analytics';

const ConfirmCheckoutScreen = ({ route, navigation }) => {
  const { listing, event, sessionId } = route.params;

  const handleContinueToCheckout = () => {
    analytics.trackCheckoutInitiated(event.id, listing.id, listing.price);
    
    navigation.navigate('CheckoutWebView', {
      listing,
      event,
      sessionId
    });
  };

  const handleKeepSwiping = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.iconGradient}
          >
            <Ionicons name="checkmark-circle" size={64} color="white" />
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={styles.title}>Great Choice!</Text>
        <Text style={styles.subtitle}>
          Ready to purchase these seats?
        </Text>

        {/* Event Info */}
        <View style={styles.infoCard}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              {event.venue?.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#6b7280" />
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
        </View>

        {/* Seat Details */}
        <View style={styles.seatCard}>
          <Text style={styles.seatCardTitle}>Seat Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Section</Text>
            <Text style={styles.detailValue}>{listing.section}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Row</Text>
            <Text style={styles.detailValue}>{listing.row}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seats</Text>
            <Text style={styles.detailValue}>{listing.seats}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{listing.quantity} tickets</Text>
          </View>

          {listing.viewQuality && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>View Quality</Text>
              <Text style={[styles.detailValue, styles.highlight]}>
                {listing.viewQuality}
              </Text>
            </View>
          )}
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price per ticket</Text>
            <Text style={styles.priceValue}>${listing.price}</Text>
          </View>
          
          <View style={styles.priceDivider} />
          
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total ({listing.quantity} tickets)</Text>
            <Text style={styles.totalValue}>${listing.totalPrice}</Text>
          </View>
          
          <Text style={styles.feeNote}>
            * Additional fees may apply at checkout
          </Text>
        </View>

        {/* Partner Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={24} color="#6366f1" />
          <Text style={styles.noticeText}>
            You'll be redirected to SeatGeek to complete your purchase securely.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleKeepSwiping}
        >
          <Text style={styles.secondaryButtonText}>Keep Swiping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinueToCheckout}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.primaryButtonText}>Buy via SeatGeek</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  content: {
    padding: 20
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
    flex: 1
  },
  seatCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  seatCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827'
  },
  highlight: {
    color: '#6366f1'
  },
  priceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280'
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1'
  },
  feeNote: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    fontStyle: 'italic'
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 12,
    lineHeight: 20
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'white'
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1'
  },
  primaryButton: {
    flex: 2,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden'
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
});

export default ConfirmCheckoutScreen;