// src/services/api.js
// API service for communicating with backend

import axios from 'axios';
import { API_BASE_URL } from '@env';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL || 'http://localhost:3000/api/v1',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Handle specific error codes
          if (error.response.status === 401) {
            // Unauthorized - maybe trigger logout
            console.log('Unauthorized - token may be expired');
          }
        } else if (error.request) {
          // Network error
          console.error('Network error:', error.message);
        }
        return Promise.reject(error);
      }
    );

    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  // Generic methods
  async get(url, params = {}) {
    return this.client.get(url, { params });
  }

  async post(url, data = {}) {
    return this.client.post(url, data);
  }

  async put(url, data = {}) {
    return this.client.put(url, data);
  }

  async delete(url) {
    return this.client.delete(url);
  }

  // Events
  async searchEvents(query, location, filters = {}) {
    return this.get('/events/search', {
      q: query,
      location,
      ...filters
    });
  }

  async getPopularEvents(location, category) {
    return this.get('/events/popular', { location, category });
  }

  async getEvent(eventId) {
    return this.get(`/events/${eventId}`);
  }

  async getEventListings(eventId, filters = {}) {
    return this.get(`/events/${eventId}/listings`, filters);
  }

  // Swipes
  async recordSwipe(eventId, listingId, direction, sessionId, position) {
    return this.post('/swipes', {
      eventId,
      listingId,
      direction,
      sessionId,
      swipePosition: position
    });
  }

  async getSwipeHistory(limit = 20, offset = 0) {
    return this.get('/swipes/history', { limit, offset });
  }

  async getSwipeStats() {
    return this.get('/swipes/stats');
  }

  // Checkout
  async initiateCheckout(listingId, eventId, sessionId) {
    return this.post('/checkout/initiate', {
      listingId,
      eventId,
      sessionId
    });
  }

  async updateCheckoutStatus(trackingId, status) {
    return this.post('/checkout/callback', {
      trackingId,
      status
    });
  }

  async getCheckoutHistory() {
    return this.get('/checkout/history');
  }

  // User
  async updateProfile(data) {
    return this.put('/users/profile', data);
  }
}

export default new ApiService();