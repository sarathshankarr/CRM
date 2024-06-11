// apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, BASE_URL, CUSTOMER_URL } from './apiConfig';
import { NavigationContext } from './navigationContext'; // Import the context
import React, { useContext } from 'react'; // Import necessary hooks

// Create an instance of axios
let ApiClient = axios.create({
  baseURL: CUSTOMER_URL,
  timeout: 10000,
});

// Function to save token and update headers
const saveToken = async (data) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    ApiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token.access_token}`;
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

ApiClient.interceptors.request.use(
  async (config) => {
    const newUserData = await AsyncStorage.getItem('userData');
    global.userData = JSON.parse(newUserData);
    if (global.userData && global.userData.token.access_token) {
      config.headers.Authorization = `Bearer ${global.userData.token.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('loggedIn');
        await AsyncStorage.removeItem('userRole');
        await AsyncStorage.removeItem('userRoleId');
        await AsyncStorage.removeItem('loggedInUser');
        await AsyncStorage.removeItem('selectedCompany');

        const navigation = useContext(NavigationContext); // Use the navigation context
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (redirectError) {
        console.error('Redirect to login error:', redirectError);
      }
    }
    return Promise.reject(error);
  }
);

export default ApiClient;
