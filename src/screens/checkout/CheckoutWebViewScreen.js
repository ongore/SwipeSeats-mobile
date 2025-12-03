import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

const CheckoutWebViewScreen = ({ route, navigation }) => {
  const { listing, event, sessionId } = route.params;
  const [loading, setLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  React.useEffect(() => {
    initiateCheckout();
  }, []);

  const initiateCheckout = async () => {
    try {
      const response = await api.initiateCheckout(listing.id, event.id, sessionId);
      setCheckoutUrl(response.data.checkoutUrl);
    } catch (error) {
      console.error('Checkout error:', error);
      navigation.goBack();
    }
  };

  const handleNavigationStateChange = (navState) => {
    // Detect success/cancel from URL
    if (navState.url.includes('success') || navState.url.includes('confirmation')) {
      navigation.navigate('Success', { event, listing });
    }
  };

  if (!checkoutUrl) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: checkoutUrl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)' }
});

export default CheckoutWebViewScreen;