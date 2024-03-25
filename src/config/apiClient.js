import axios from 'axios';
import {API, BASE_URL} from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let ApiClient = axios.create({
  baseURL: BASE_URL.SIT,
  timeout: 10000,
});
ApiClient.interceptors.request.use(
  async configure => {
    const newUserData = await AsyncStorage.getItem('userdata');
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
export default ApiClient;
