import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { encode as base64Encode } from 'base-64';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidString } from '../../Helper/Helper';
import { API, USER_ID, USER_PASSWORD } from '../../config/apiConfig';

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!isValidString(username)) {
      Alert.alert('crm.codeverse.co.says', 'Enter the username');
    } else if (!isValidString(password)) {
      Alert.alert('crm.codeverse.co.says', 'Enter the password');
    } else {
      setLoading(true);
      const postData = new URLSearchParams();
      postData.append('username', username);
      postData.append('grant_type', 'password');
      postData.append('password', password);
      const credentials = base64Encode(`${USER_ID}:${USER_PASSWORD}`);
  
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      };
  
      axios
        .post(API.LOGIN, postData.toString(), { headers })
        .then(response => {
          if (isValidString(response.data)) {
            saveToken(response.data);
          } else {
            console.log('Response:', JSON.stringify(response.data));
          }
        })
        .catch(error => {
          if (error?.response?.data?.error_description) {
            Alert.alert(
              'crm.codeverse.co.says',
              error.response.data.error_description,
            );
          }
        })
        .finally(() => setLoading(false));
    }
  };
  
  const saveToken = async data => {
    try {
      await AsyncStorage.setItem('userdata', JSON.stringify(data));
      getToken(data); // Pass data to getToken function
    } catch (error) {}
  };
  
  const getToken = async userData => { // Accept userData as parameter
    const userToken = JSON.stringify(userData); // Store userData directly
    console.log(userData);
    global.userData = userData;
    navigation.navigate('Main', { userData: userData }); // Pass userData to Main screen
  };
  

  const handleForgotPassword = () => {
    Alert.alert('Forgot password clicked');
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000"
          onChangeText={text => setUsername(text)}
          value={username}
        />
        <Image
          source={require('../../../assets/email.png')}
          style={styles.inputImage}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <Image
          source={require('../../../assets/lock.png')}
          style={styles.inputImage}
        />
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.rememberMeText}>Remember me</Text>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: 'black',
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  rememberMeText: {
    fontSize: 16,
    color: '#000',
    marginRight: 'auto',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#007bff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Login;
