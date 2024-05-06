import axios from 'axios';
import { API, BASE_URL } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let ApiClient = axios.create({
  baseURL: BASE_URL.SIT,
  timeout: 10000,
});

ApiClient.interceptors.request.use(
  async (config) => {
    let userData = await AsyncStorage.getItem('userdata');
    if (userData) {
      userData = JSON.parse(userData);
      if (isTokenExpired(userData)) {
        // Token expired, refresh it
        userData = await refreshToken(userData);
        if (!userData) {
          // Refresh failed or token still invalid, navigate to login
          // Add your navigation logic here
          return config;
        }
      }
      config.headers.Authorization = `Bearer ${userData.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const isTokenExpired = (userData) => {
  if (userData && userData.expires_in) {
    const expiryTime = userData.expires_in * 1000; // Convert to milliseconds
    return new Date().getTime() > expiryTime;
  }
  return true; // Token is considered expired if no expiry time found
};

const refreshToken = async (userData) => {
  try {
    const response = await axios.post(
      API.LOGIN,
      `grant_type=refresh_token&refresh_token=${userData.refresh_token}`,
      {
        headers: {
          Authorization: `Basic ${base64Encode(`${USER_ID}:${USER_PASSWORD}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    if (response.data) {
      await AsyncStorage.setItem('userdata', JSON.stringify(response.data));
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export default ApiClient;
