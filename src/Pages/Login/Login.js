import React, {useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {encode as base64Encode} from 'base-64';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isValidString} from '../../Helper/Helper';
import {
  API,
  CUSTOMER_URL,
  USER_ID,
  USER_PASSWORD,
} from '../../config/apiConfig';
import {setLoggedInUser, setUserRole} from '../../redux/actions/Actions';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [code, setCode] = useState('');

  const getCustomerUrl = async () => {
    setLoading(true);
    try {
      const response = await axios.get(CUSTOMER_URL + code);
      setLoading(false);
      console.log('API Response:', response.data.response.url);
      if (isValidString(response?.data?.response?.url)) {
        handleLogin(response?.data?.response?.url);
      } else {
        Alert.alert('Invalid Code', 'Please enter a valid customer code.');
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        Alert.alert('Invalid Code', 'Please enter a valid customer code.');
      } else {
        Alert.alert('Alert', 'please Enter the code.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goingToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleLogin = async (productURL) => {
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

    try {
      const response = await axios.post( productURL+API.LOGIN, postData.toString(), {
        headers,
      });
      if (isValidString(response.data)) {
        let data= {token:response.data,productURL:productURL}
        await saveToken(data);
        await getUsers(response.data,productURL);
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      } else {
        console.log('Response:', JSON.stringify(response.data));
      }
    } catch (error) {
      if (error?.response?.data?.error_description) {
        Alert.alert(
          'crm.codeverse.co.says',
          error.response.data.error_description,
        );
      }
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  const saveToken = async data => {
    try {
      console.log('Saving token:', JSON.stringify(data));
      await AsyncStorage.setItem('userdata', JSON.stringify(data));
      await AsyncStorage.setItem('loggedIn', 'true');
      global.userData = data; // Ensure global userData is updated
      console.log("globaluserData",global.userData)
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const getUsers = async (userData, productURL) => {
    console.log('getUsers userData:', userData);
    const apiUrl = `${productURL}${API.ADD_USERS}/${userData.userId}`; // Update API URL to include dynamic userId
    console.log("apurl",apiUrl)
    try {
      const response = await axios.get(apiUrl, {
        headers: {Authorization: `Bearer ${userData.access_token}`},
      });
      const loggedInUser = response.data.response.users[0]; // Since response is expected to have only one user with given userId
      if (loggedInUser) {
        // console.log('Logged in user:', loggedInUser);
        dispatch(setLoggedInUser(loggedInUser));
        dispatch(setUserRole(loggedInUser.role));
        await saveUserDataToStorage(loggedInUser);
        const roles = loggedInUser.role;
        let roleName = '';
        let roleId = '';
        for (const role of roles) {
          const name = role.role;
          if (name) {
            if (
              name === 'admin' ||
              name === 'Distributor' ||
              name === 'Retailer'
            ) {
              roleName = name;
              roleId = role.id;
              break;
            }
          }
        }
        if (roleName && roleId) {
          await saveRoleToStorage({roleName, roleId});
        } else {
          Alert.alert(
            'Unauthorized role',
            'You do not have access to this application.',
          );
        }
      } else {
        Alert.alert('No user data found', 'Failed to fetch user data.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert(
        'Failed to fetch user data',
        'An error occurred while fetching user data.',
      );
    }
  };

  const saveUserDataToStorage = async userData => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const saveRoleToStorage = async ({roleName, roleId}) => {
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
          style={{height: 103, width: 103, marginTop: 30}}
          source={require('../../../assets/loginbg.png')}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login to Your Account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Code"
            placeholderTextColor="#000"
            onChangeText={text => setCode(text)}
            value={code}
          />
          <Image
            source={require('../../../assets/email.png')}
            style={styles.inputImage}
          />
        </View>
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
            secureTextEntry={!showPassword} // Toggle secureTextEntry based on state
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              source={require('../../../assets/lock.png')}
              style={styles.inputImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          {/* <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.text}>Forgot Password?</Text>
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={getCustomerUrl}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.line} />
        {/* <View>
          <Text style={styles.signintext}>Or sign in with</Text>
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <View>
          <TouchableOpacity>
            <Image
              style={styles.googleimg}
              source={require('../../../assets/google.png')}></Image></TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity>
            <Image
              style={styles.facebookimg}
              source={require('../../../assets/Facebook.png')}></Image></TouchableOpacity>
          </View>
        </View> */}
      </View>
      <View style={{justifyContent: 'flex-end', flex: 1, marginVertical: 10}}>
        {/* <TouchableOpacity onPress={goingToSignUp}>
                <Text style={{textAlign:'center'}}>Don’t have an account? Sign Up</Text>
        </TouchableOpacity> */}
        <Text style={{textAlign: 'center'}}>
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
  signintext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  googleimg: {
    height: 34,
    width: 34,
  },
  facebookimg: {
    height: 38,
    width: 38,
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
