import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { encode as base64Encode } from 'base-64';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidString } from '../../Helper/Helper';
import { API, USER_ID, USER_PASSWORD } from '../../config/apiConfig';
import { setLoggedInUser, setUserRole } from '../../redux/actions/Actions';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
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
  
    axios.post(API.LOGIN, postData.toString(), { headers })
      .then(response => {
        if (isValidString(response.data)) {
          saveToken(response.data); // Save token immediately after login
        } else {
          console.log('Response:', JSON.stringify(response.data));
        }
      })
      .catch(error => {
        if (error?.response?.data?.error_description) {
          Alert.alert('crm.codeverse.co.says', error.response.data.error_description);
        }
      })
      .finally(() => setLoading(false));
      Keyboard.dismiss();
  };
  
  const saveToken = async data => {
    try {
      await AsyncStorage.setItem('userdata', JSON.stringify(data));
      await AsyncStorage.setItem('loggedIn', 'true'); // Add this line to indicate that the user is logged in
      getToken(data); // After saving token, get user data
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };
  
  
  const getToken = async userData => {
    const userToken = JSON.stringify(userData);
    console.log(userData);
    global.userData = userData;
    await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData)); // Store logged-in user data
    getUsers(); // Proceed to fetch additional user data
  };
  

  const getUsers = () => {
    const apiUrl = `${API.ADD_USERS}`;
    axios.get(apiUrl, { headers: { Authorization: `Bearer ${global.userData.access_token}` } })
      .then(response => {
        const users = response.data.response.users;
        const loggedInUserId = global.userData.userId; // Get the logged-in user's ID
        const loggedInUser = users.find(user => user.userId === loggedInUserId); // Find the logged-in user
        if (loggedInUser) {
          console.log('Logged in user:', loggedInUser);
          dispatch(setLoggedInUser(loggedInUser)); // Dispatch setLoggedInUser action with loggedInUser data
          dispatch(setUserRole(loggedInUser.role)); // Dispatch setUserRole action with user role
          saveUserDataToStorage(loggedInUser); // Save user data to AsyncStorage
          const roles = loggedInUser.role;
          let roleName = '';
          let roleId = '';
          for (const role of roles) {
            const name = role.role;
            if (name) {
              if (name === 'admin' || name === 'Distributor' || name === 'Retailer') {
                roleName = name; // Set roleName based on user role
                roleId = role.id; // Set roleId based on user role
                break; // Exit loop after finding a valid role
              }
            }
          }
          if (roleName && roleId) {
            saveRoleToStorage({ roleName, roleId }); // Save roleName and roleId to AsyncStorage
            navigation.navigate('Main'); // Navigate to Main screen
          } else {
            Alert.alert('Unauthorized role', 'You do not have access to this application.');
          }
        } else {
          Alert.alert('No user data found', 'Failed to fetch user data.');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        Alert.alert('Failed to fetch user data', 'An error occurred while fetching user data.');
      });
  };

  const saveUserDataToStorage = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const saveRoleToStorage = async ({ roleName, roleId }) => {
    try {
      await AsyncStorage.setItem('userRole', roleName);
      await AsyncStorage.setItem('userRoleId', roleId.toString());
    } catch (error) {
      console.error('Error saving user role and ID:', error);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot password clicked');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: 103, width: 103, marginTop: 30 }}
          source={require('../../../assets/loginbg.png')}
        />
      </View>
      <View style={styles.formContainer}>
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
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.line} />
      </View>
      <View style={{ justifyContent: 'flex-end', flex: 1, marginVertical: 10 }}>
        <Text style={{ textAlign: 'center' }}>
          All rights with Codeverse Technologies
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
    color: '#390050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#D9D9D947',
  },
  formContainer: {
    width: '100%',
    marginTop: 30,
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
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#390050',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#390050',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  line: {
    borderBottomColor: '#615858C7',
    borderBottomWidth: 1,
    marginVertical: 30,
    marginHorizontal: 30,
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
