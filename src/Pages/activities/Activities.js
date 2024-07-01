import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tasks from './Tasks';
import Call from './Call';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const label = route.name;
        const isFocused = route.key === state.routes[state.index].key;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabButton, isFocused && styles.activeTabButton]}>
            <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Activities = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Tasks" component={Tasks} />
        <Tab.Screen name="Call" component={Call} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up entire available space
    backgroundColor: '#fff', // Red background color for the entire screen
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 30,
    borderColor: '#000',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2, // Corrected property name
    borderBottomColor: '#000', // Added correct color property
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Activities;
