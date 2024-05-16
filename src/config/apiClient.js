import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, BASE_URL } from './apiConfig';

let ApiClient = axios.create({
  baseURL: BASE_URL.SIT,
  timeout: 10000,
});

// Function to refresh token
const refreshToken = async () => {
  const refreshToken = global.userData.refresh_token;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const postData = new URLSearchParams();
  postData.append('grant_type', 'refresh_token');
  postData.append('refresh_token', refreshToken);
  const credentials = `${USER_ID}:${USER_PASSWORD}`;

  try {
    const response = await axios.post(API.LOGIN, postData.toString(), {
      headers: {
        ...headers,
        Authorization: `Basic ${btoa(credentials)}`,
      },
    });
    if (response.status === 200) {
      saveToken(response.data);
      return response.data.access_token;
    }
  } catch (error) {
    console.error('Refresh Token Error:', error);
    throw error;
  }
};


ApiClient.interceptors.request.use(
  async configure => {
    const newUserData = await AsyncStorage.getItem('userData');
    global.userData = JSON.parse(newUserData);
    console.log('Bearer token is ' + global.userData.access_token);
    if (global.userData != null) {
      configure.headers.Authorization = `Bearer ${global.userData.access_token}`;
    }
    return configure;
  },
  error => {
    return Promise.reject(error);
  },
);



// Function to save token and update headers
const saveToken = async data => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    ApiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
  } catch (error) {
    console.error('Error saving token:', error);
  }
};


// Response interceptor to handle token expiration
ApiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        // Handle refresh token error
        // For example, redirect to login screen
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default ApiClient;