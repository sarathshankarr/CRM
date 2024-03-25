import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';
import Store from '../bottom/Store';
import Categories from '../bottom/Categories';

const Bottom = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Bottom.Navigator>
      <Bottom.Screen
        name="Store"
        component={Store}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/store.png')}
              style={{ height: 24, width: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="Categories"
        component={Categories}
        options={{ headerShown: false }}
      />
    </Bottom.Navigator>
  );
};

export default HomeScreen;
