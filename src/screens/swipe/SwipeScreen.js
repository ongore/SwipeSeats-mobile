// src/screens/swipe/SwipeScreen.js
// Main swipe interface for browsing seats

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeCard from '../../components/SwipeCard';
import api from '../../services/api';
import sessionService from '../../services/session';
import analytics from '../../utils/analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SwipeScreen = ({ route, navigation }) => {
  const { event } = route.params;
  
  const [listings, setListings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);

  useEffect(() => {
    loadListings();
    initSession();
    
    // Track screen view
    analytics.trackScreenView('Swipe');
    analytics.trackEventView(event.id, event.title);
  }, []);

  const initSession = async () => {
    const id = await sessionService.getSessionId();
    setSessionId(id);
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      
      const response = await api.getEventListings(event.id, {
        sort: 'value',
        quantity: 2
      });

      if (response.data.listings.length === 0) {
        Alert.alert(
          'No Seats Available',
          'There are no seats available for this event at the moment.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      setListings(response.data.listings);
    } catch (error) {
      console.error('Error loading listings:', error);
      Alert.alert(
        'Error',
        'Unable to load seats. Please try again.',
        [
          { text: 'Retry', onPress: loadListings },
          { text: 'Cancel', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction, listing) => {
    try {
      // Track swipe
      analytics.trackSwipe(event.id, listing.id, direction, currentIndex);

      // Record swipe in backend
      if (sessionId) {
        await api.recordSwipe(
          event.id,
          listing.id,
          direction,
          sessionId,
          currentIndex
        );
      }

      setSwipeCount(prev => prev + 1);

      // If right swipe, navigate to confirm checkout
      if (direction === 'right') {
        navigation.navigate('ConfirmCheckout', {
          listing,
          event,
          sessionId
        });
      }

      // Move to next card
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);

      // Check if we're running out of cards
      if (currentIndex >= listings.length - 3) {
        // Could load more listings here
        console.log('Running low on cards, could load more...');
      }

      // Check if we've reached the end
      if (currentIndex >= listings.length - 1) {
        setTimeout(() => {
          showEndScreen();
        }, 500);
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  const handleManualSwipe = (direction) => {
    if (currentIndex < listings.length) {
      const currentListing = listings[currentIndex];
      handleSwipe(direction, currentListing);
      
      // Trigger card animation manually
      // This would need to be implemented with refs
    }
  };

  const showEndScreen = () => {
    Alert.alert(
      'No More Seats',
      `You've viewed all ${swipeCount} available seats for this event.`,
      [
        {
          text: 'View Other Events',
          onPress: () => navigation.navigate('Home')
        },
        {
          text: 'Adjust Filters',
          onPress: () => {
            // In V1.1, open filter modal
            Alert.alert('Filters', 'Filter options coming soon!');
          }
        }
      ]
    );
  };

  const renderCard = (listing, index) => {
    if (index > currentIndex + 2) return null;

    const isActive = index === currentIndex;
    const offset = (index - currentIndex) * 8;
    const scale = 1 - (index - currentIndex) * 0.05;

    return (
      <SwipeCard
        key={listing.id}
        listing={listing}
        onSwipe={handleSwipe}
        isActive={isActive}
        style={{
          zIndex: listings.length - index,
          transform: [
            { translateY: offset },
            { scale: scale }
          ]
        }}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading seats...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={styles.swipeCounter}>
            {currentIndex + 1} / {listings.length}
          </Text>
        </View>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {listings.map((listing, index) => renderCard(listing, index))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleManualSwipe('left')}
          disabled={currentIndex >= listings.length}
        >
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.infoButton]}
          onPress={() => {
            Alert.alert(
              'Seat Details',
              'Tap on the card for more information about this seat.'
            );
          }}
        >
          <Ionicons name="information" size={24} color="#6366f1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleManualSwipe('right')}
          disabled={currentIndex >= listings.length}
        >
          <Ionicons name="checkmark" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Help text */}
      {currentIndex === 0 && swipeCount === 0 && (
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Swipe right to buy, left to skip
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  backButton: {
    padding: 8
  },
  headerContent: {
    flex: 1,
    marginLeft: 12
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2
  },
  swipeCounter: {
    fontSize: 14,
    color: '#6b7280'
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    gap: 24
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  rejectButton: {
    backgroundColor: '#ef4444'
  },
  likeButton: {
    backgroundColor: '#10b981'
  },
  infoButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#6366f1',
    width: 48,
    height: 48,
    borderRadius: 24
  },
  helpContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
});

export default SwipeScreen;