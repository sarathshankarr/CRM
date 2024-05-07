import axios from 'axios';
import { API, BASE_URL } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let ApiClient = axios.create({
  baseURL: BASE_URL.SIT,
  timeout: 10000,
});

ApiClient.interceptors.request.use(
  async configure => {
    let newUserData = await AsyncStorage.getItem('userdata');
    if (newUserData) {
      newUserData = JSON.parse(newUserData);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (currentTime < newUserData.expires_in) { // Check if token is still valid
        console.log('Bearer token is ' + newUserData.access_token);
        configure.headers.Authorization = `Bearer ${newUserData.access_token}`;
      } else {
        // Token expired, refresh token
        try {
          const refreshResponse = await axios.post(API.LOGIN, {
            grant_type: 'refresh_token',
            refresh_token: newUserData.refresh_token,
            client_id: USER_ID,
            client_secret: USER_PASSWORD,
          });
          if (refreshResponse.data.access_token) {
            newUserData.access_token = refreshResponse.data.access_token;
            newUserData.expires_in = currentTime + refreshResponse.data.expires_in; // Update expiration time
            await AsyncStorage.setItem('userdata', JSON.stringify(newUserData));
            console.log('Token refreshed');
            configure.headers.Authorization = `Bearer ${newUserData.access_token}`;
          } else {
            console.log('Failed to refresh token');
          }
        } catch (error) {
          console.log('Error refreshing token:', error.message);
        }
      }
    }
    return configure;
  },
  error => {
    return Promise.reject(error);
  },
);

export default ApiClient;
