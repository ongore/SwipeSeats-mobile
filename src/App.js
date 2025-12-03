// App.js
// Main React Native app entry point

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LocationSetupScreen from './src/screens/auth/LocationSetupScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import EventDetailsScreen from './src/screens/events/EventDetailsScreen';
import SwipeScreen from './src/screens/swipe/SwipeScreen';
import ConfirmCheckoutScreen from './src/screens/checkout/ConfirmCheckoutScreen';
import CheckoutWebViewScreen from './src/screens/checkout/CheckoutWebViewScreen';
import SuccessScreen from './src/screens/checkout/SuccessScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import SettingsScreen from './src/screens/profile/SettingsScreen';

// Import services & context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { initializeApp } from './src/services/firebase';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Initialize Firebase
initializeApp();

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="LocationSetup" component={LocationSetupScreen} />
    </Stack.Navigator>
  );
}

// Main App Stack
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{ 
          title: 'Event Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="Swipe" 
        component={SwipeScreen}
        options={{ 
          title: 'Find Your Seat',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="ConfirmCheckout" 
        component={ConfirmCheckoutScreen}
        options={{ 
          title: 'Confirm Purchase',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="CheckoutWebView" 
        component={CheckoutWebViewScreen}
        options={{ 
          title: 'Checkout',
          presentation: 'fullScreenModal'
        }}
      />
      <Stack.Screen 
        name="Success" 
        component={SuccessScreen}
        options={{ 
          title: 'Success!',
          presentation: 'modal',
          headerLeft: () => null
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

// Root Navigator
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    setTimeout(() => {
      setIsReady(true);
    }, 1500);
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}