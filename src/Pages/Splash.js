import React, {isValidElement, useEffect} from 'react';
import {Text, View} from 'react-native';
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
    <View>
      <Text>Splash</Text>
    </View>
  );
};

export default Splash;
