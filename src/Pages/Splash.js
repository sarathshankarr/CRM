import React, {isValidElement, useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {isValidString} from '../Helper/Helper';
const Splash = props => {
  const navigation = useNavigation();

  useEffect(() => {
    props.navigation.addListener('focus', async () => {
      const userToken = await AsyncStorage.getItem('userdata');
      if (isValidString(userToken)) {
        global.userData = JSON.parse(userToken);
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      } else {
        navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/Logo.png')} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#fff"
  },
  logo: {
    width: '95%', // Adjust the width as needed
    height: '95%', // Adjust the height as needed
    resizeMode: 'contain', // This ensures the image fits within the bounds
  },
});

export default Splash;
