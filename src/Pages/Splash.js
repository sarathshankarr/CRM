import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isValidString } from '../Helper/Helper';

const Splash = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const userToken = await AsyncStorage.getItem('userdata');
      const isLoggedIn = await AsyncStorage.getItem('loggedIn');
      if (isValidString(userToken) && isLoggedIn === 'true') {
        global.userData = JSON.parse(userToken);
        setUserData(JSON.parse(userToken));
        console.log('User is logged in');
        console.log('Logged in user:', JSON.stringify(JSON.parse(userToken)));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        console.log('User is not logged in');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/Logo.png')} />
      {userData && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Logged in user:</Text>
          <Text>{JSON.stringify(userData)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '95%', // Adjust the width as needed
    height: '95%', // Adjust the height as needed
    resizeMode: 'contain', // This ensures the image fits within the bounds
  },
  userInfo: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  userInfoText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Splash;
