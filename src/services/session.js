import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

class SessionService {
  constructor() {
    this.currentSessionId = null;
  }

  async startSession() {
    this.currentSessionId = uuid.v4();
    await AsyncStorage.setItem('currentSessionId', this.currentSessionId);
    await AsyncStorage.setItem('sessionStartTime', new Date().toISOString());
    return this.currentSessionId;
  }

  async getSessionId() {
    if (!this.currentSessionId) {
      this.currentSessionId = await AsyncStorage.getItem('currentSessionId');
      
      if (!this.currentSessionId) {
        await this.startSession();
      }
    }
    
    return this.currentSessionId;
  }

  async endSession() {
    await AsyncStorage.removeItem('currentSessionId');
    await AsyncStorage.removeItem('sessionStartTime');
    this.currentSessionId = null;
  }

  async getSessionDuration() {
    const startTime = await AsyncStorage.getItem('sessionStartTime');
    if (!startTime) return 0;
    
    const start = new Date(startTime);
    const now = new Date();
    return Math.floor((now - start) / 1000);
  }
}

export default new SessionService();