// src/components/SwipeCard.js
// Tinder-style swipeable card for seat listings

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const SwipeCard = ({ listing, onSwipe, style, isActive = true }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (!isActive) return;
      
      translateX.value = event.translationX + context.startX;
      translateY.value = event.translationY + context.startY;
    },
    onEnd: (event) => {
      if (!isActive) return;

      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        // Swipe left - reject
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(onSwipe)('left', listing);
      } else if (shouldSwipeRight) {
        // Swipe right - like
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(onSwipe)('right', listing);
      } else {
        // Snap back
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH],
      [1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` }
      ],
      opacity
    };
  });

  const likeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    )
  }));

  const nopeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    )
  }));

  const renderValueBadge = () => {
    if (!listing.valueScore) return null;

    let badgeColor = '#10b981'; // green
    let badgeText = 'Great Value';

    if (listing.valueScore >= 8) {
      badgeColor = '#10b981';
      badgeText = 'Best Value';
    } else if (listing.valueScore >= 6) {
      badgeColor = '#f59e0b';
      badgeText = 'Good Value';
    } else {
      badgeColor = '#6b7280';
      badgeText = 'Fair Value';
    }

    return (
      <View style={[styles.valueBadge, { backgroundColor: badgeColor }]}>
        <Ionicons name="star" size={14} color="white" />
        <Text style={styles.valueBadgeText}>{badgeText}</Text>
      </View>
    );
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={isActive}>
      <Animated.View style={[styles.card, style, animatedStyle]}>
        {/* LIKE overlay */}
        <Animated.View style={[styles.likeOverlay, likeOpacityStyle]}>
          <View style={[styles.overlayBorder, styles.likeBorder]}>
            <Text style={styles.overlayText}>BUY</Text>
          </View>
        </Animated.View>

        {/* NOPE overlay */}
        <Animated.View style={[styles.nopeOverlay, nopeOpacityStyle]}>
          <View style={[styles.overlayBorder, styles.nopeBorder]}>
            <Text style={styles.overlayText}>SKIP</Text>
          </View>
        </Animated.View>

        {/* Card content */}
        <View style={styles.cardContent}>
          {/* Section/Row header */}
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.sectionText}>{listing.section}</Text>
            <Text style={styles.rowText}>Row {listing.row}</Text>
          </LinearGradient>

          {/* Main content area */}
          <View style={styles.mainContent}>
            {/* Price - hero element */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price per ticket</Text>
              <Text style={styles.priceAmount}>${listing.price}</Text>
              <Text style={styles.totalPrice}>
                Total: ${listing.totalPrice} for {listing.quantity} tickets
              </Text>
            </View>

            {/* Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="ticket-outline" size={20} color="#6b7280" />
                <Text style={styles.detailText}>
                  Seats {listing.seats}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={20} color="#6b7280" />
                <Text style={styles.detailText}>
                  {listing.quantity} tickets
                </Text>
              </View>

              {listing.viewQuality && (
                <View style={styles.detailRow}>
                  <Ionicons name="eye-outline" size={20} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {listing.viewQuality} view
                  </Text>
                </View>
              )}
            </View>

            {/* Value badge */}
            {renderValueBadge()}
          </View>

          {/* Info button */}
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute'
  },
  cardContent: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden'
  },
  header: {
    padding: 24,
    paddingBottom: 32
  },
  sectionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4
  },
  rowText: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600'
  },
  mainContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center'
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  priceAmount: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8
  },
  totalPrice: {
    fontSize: 16,
    color: '#6b7280'
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  detailText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500'
  },
  valueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20
  },
  valueBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14
  },
  infoButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  likeOverlay: {
    position: 'absolute',
    top: 60,
    left: 40,
    zIndex: 10
  },
  nopeOverlay: {
    position: 'absolute',
    top: 60,
    right: 40,
    zIndex: 10
  },
  overlayBorder: {
    borderWidth: 4,
    borderRadius: 8,
    padding: 8
  },
  likeBorder: {
    borderColor: '#10b981',
    transform: [{ rotate: '20deg' }]
  },
  nopeBorder: {
    borderColor: '#ef4444',
    transform: [{ rotate: '-20deg' }]
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold'
  }
});

export default SwipeCard;