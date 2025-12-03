// src/screens/home/HomeScreen.js
// Main home screen with event discovery

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [popularEvents, setPopularEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadPopularEvents();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadPopularEvents = async () => {
    try {
      setLoading(true);
      
      const location = user?.defaultLocation || 'Chicago, IL';
      const response = await api.getPopularEvents(location);
      
      setPopularEvents(response.data.events);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      
      const location = user?.defaultLocation;
      const response = await api.searchEvents(searchQuery, location);
      
      setSearchResults(response.data.events);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPopularEvents();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const EventCard = ({ event, horizontal = false }) => (
    <TouchableOpacity
      style={[
        styles.eventCard,
        horizontal && styles.horizontalCard
      ]}
      onPress={() => navigation.navigate('EventDetails', { event })}
    >
      <Image
        source={{ uri: event.imageUrl || 'https://via.placeholder.com/300x200' }}
        style={[
          styles.eventImage,
          horizontal && styles.horizontalImage
        ]}
      />
      
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.title}
        </Text>
        
        <View style={styles.eventMeta}>
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text style={styles.eventMetaText}>
            {event.venue?.city}, {event.venue?.state}
          </Text>
        </View>
        
        <View style={styles.eventMeta}>
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text style={styles.eventMetaText}>
            {formatDate(event.datetime)}
          </Text>
        </View>
        
        {event.minPrice && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>From ${event.minPrice}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderPopularSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Near You</Text>
        <Text style={styles.sectionSubtitle}>
          {user?.defaultLocation || 'Your area'}
        </Text>
      </View>

      <FlatList
        data={popularEvents}
        renderItem={({ item }) => <EventCard event={item} horizontal />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const renderSearchResults = () => {
    if (searching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      );
    }

    if (searchResults.length === 0 && searchQuery.length > 2) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>No events found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Results</Text>
        <FlatList
          data={searchResults}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.verticalList}
        />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hey {user?.name?.split(' ')[0] || 'there'}! 👋
          </Text>
          <Text style={styles.subtitle}>Find your perfect seats</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, artists, teams..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366f1"
          />
        }
      >
        {searchQuery.length > 2 ? (
          renderSearchResults()
        ) : (
          <>
            {renderPopularSection()}
            
            {/* Categories Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse by Category</Text>
              <View style={styles.categoriesGrid}>
                {[
                  { name: 'Concerts', icon: 'musical-notes', color: '#6366f1' },
                  { name: 'Sports', icon: 'basketball', color: '#10b981' },
                  { name: 'Theater', icon: 'film', color: '#f59e0b' },
                  { name: 'Comedy', icon: 'happy', color: '#ef4444' }
                ].map(category => (
                  <TouchableOpacity
                    key={category.name}
                    style={[styles.categoryCard, { backgroundColor: category.color }]}
                    onPress={() => {
                      setSearchQuery(category.name.toLowerCase());
                    }}
                  >
                    <Ionicons name={category.icon} size={32} color="white" />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: 'white'
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827'
  },
  content: {
    flex: 1
  },
  section: {
    marginTop: 24
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280'
  },
  horizontalList: {
    paddingHorizontal: 20
  },
  verticalList: {
    paddingHorizontal: 20
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  horizontalCard: {
    width: 280,
    marginRight: 16
  },
  eventImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e5e7eb'
  },
  horizontalImage: {
    height: 140
  },
  eventInfo: {
    padding: 16
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  eventMetaText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6
  },
  priceTag: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white'
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 8
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8
  }
});

export default HomeScreen;