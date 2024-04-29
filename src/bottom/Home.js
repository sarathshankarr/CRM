import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeCategories from '../Pages/catogiries/HomeCategories';
import HomeAllProducts from '../Pages/catogiries/HomeAllProducts';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({ state, descriptors }) => {
  const navigation = useNavigation();

  const onPress = (routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
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
    justifyContent: 'space-evenly',
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 30,
    

  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: "green",
    borderWidth: 1,
    borderBottomColor: '#000',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25
  },
  tabText: {
    fontSize: 16,
    color: '#000000',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: "#fff"
  },
});


function Home() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="CATEGORIES" component={HomeCategories} />
      <Tab.Screen name="ALL PRODUCTS" component={HomeAllProducts} />
    </Tab.Navigator>
  );
}

export default Home;
