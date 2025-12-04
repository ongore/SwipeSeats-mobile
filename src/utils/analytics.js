import { Platform } from 'react-native';

class Analytics {
  trackEventView(eventId, eventTitle) {
    console.log('Analytics: Event viewed', { eventId, eventTitle });
  }

  trackSwipe(eventId, listingId, direction, position) {
    console.log('Analytics: Swipe', { 
      eventId, 
      listingId, 
      direction, 
      position 
    });
  }

  trackCheckoutInitiated(eventId, listingId, price) {
    console.log('Analytics: Checkout initiated', { 
      eventId, 
      listingId, 
      price 
    });
  }

  trackCheckoutCompleted(eventId, listingId, price, status) {
    console.log('Analytics: Checkout completed', { 
      eventId, 
      listingId, 
      price, 
      status 
    });
  }

  trackScreenView(screenName) {
    console.log('Analytics: Screen view', { screenName });
  }

  getDeviceInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      model: Platform.constants?.Model || 'unknown'
    };
  }
}

export default new Analytics();