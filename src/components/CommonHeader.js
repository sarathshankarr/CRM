import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const CommonHeader = ({ title, showDrawerButton }) => {
  const navigation = useNavigation();

  const items = useSelector(state => state);
  let addedItem = [];
  addedItem = items;

  const GoToCart = () => {
    navigation.navigate("Cart");
  }

  return (
    <View style={styles.header}>
      {showDrawerButton ? (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            resizeMode="contain"
            source={require('../../assets/menuu.png')}
            style={styles.menuimg}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            source={require('../../assets/back_arrow.png')} // Use the appropriate back arrow icon
            style={styles.menuimg}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Image
            resizeMode="contain"
            style={styles.locationimg}
            source={require('../../assets/location.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Image
            style={styles.msgimg}
            source={require('../../assets/message.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={GoToCart}>
          <View style={styles.cartContainer}>
            <Image
              resizeMode="contain"
              style={styles.cartimg}
              source={require('../../assets/cart.jpg')}
            />
            <Text style={styles.cartItemCount}>{addedItem.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#fff"
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginHorizontal: 10,
  },
  locationimg: {
    height: 25,
    width: 20,
  },
  msgimg: {
    height: 30,
    width: 35,
  },
  cartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cartimg: {
    height: 40,
    width: 40,
  },
  cartItemCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 12,
  },
  menuimg: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CommonHeader;
