import axios from 'axios';
import { API, BASE_URL } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let ApiClient = axios.create({
  baseURL: BASE_URL.SIT,
  timeout: 10000,
});

ApiClient.interceptors.request.use(
  async config => {
    try {
      const userData = await AsyncStorage.getItem('userdata');
      if (userData) {
        const { access_token, expires_in, refresh_token } = JSON.parse(userData);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (currentTime < expires_in) { // Token is still valid
          console.log('Bearer token is ' + access_token);
          config.headers.Authorization = `Bearer ${access_token}`;
        } else {
          // Token expired, refresh token
          const refreshResponse = await axios.post(API.LOGIN, {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
          });
          if (refreshResponse.data.access_token) {
            const newAccessToken = refreshResponse.data.access_token;
            const newExpiresIn = currentTime + refreshResponse.data.expires_in;
            await AsyncStorage.setItem('userdata', JSON.stringify({
              access_token: newAccessToken,
              expires_in: newExpiresIn,
              refresh_token: refresh_token
            }));
            console.log('Token refreshed');
            config.headers.Authorization = `Bearer ${newAccessToken}`;
          } else {
            console.log('Failed to refresh token');
          }
        }
      }
    } catch (error) {
      console.log('Error refreshing token:', error.message);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default ApiClient;
