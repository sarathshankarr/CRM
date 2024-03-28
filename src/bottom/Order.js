import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pending from '../Pages/pending/Pending';
import Completed from '../Pages/completed/Completed';
import Unapproved from '../Pages/unapproved/Unapproved';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({ state, descriptors }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const onPress = (routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = route.key === state.routes[state.index].key;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPress(route.name)}
            style={[styles.tabButton, isFocused && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, isFocused && styles.activeTabText]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue', // Change to your desired active tab color
  },
  tabText: {
    fontSize: 16,
    color: '#000000',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
});

function Order() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Pending" component={Pending} />
      <Tab.Screen name="Completed" component={Completed} />
      <Tab.Screen name="Unapproved" component={Unapproved} />
    </Tab.Navigator>
  );
}

export default Order;
