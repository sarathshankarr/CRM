import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../../redux/action/Action';

const AllCategoriesListed = ({ navigation, route }) => {
  const [wishlist, setWishlist] = useState({});
  const dispatch = useDispatch();
  const itemsInCart = useSelector(state => state);

  useEffect(() => {
    // Update wishlist status when component mounts or receives focus
    updateWishlistStatus();
  }, []);

  useEffect(() => {
    // Update wishlist status whenever items in cart change
    updateWishlistStatus();
  }, [itemsInCart]);

  const updateWishlistStatus = () => {
    // Create a map of items in the cart for efficient lookup
    const cartItemsMap = itemsInCart.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});

    // Check if each item in the wishlist is in the cart
    const updatedWishlist = {};
    for (const itemId in wishlist) {
      if (cartItemsMap[itemId]) {
        // Item is in cart, update wishlist accordingly
        updatedWishlist[itemId] = wishlist[itemId];
      }
    }

    setWishlist(updatedWishlist);
  };

  const toggleWishlist = item => {
    const updatedWishlist = { ...wishlist }; // Create a copy of the wishlist state

    if (isInWishlist(item)) {
      // Item exists in the wishlist, remove it
      dispatch(removeItemFromCart(item.id));
      delete updatedWishlist[item.id];
    } else {
      // Item does not exist in the wishlist, add it
      dispatch(addItemToCart(item));
      updatedWishlist[item.id] = item;
    }

    setWishlist(updatedWishlist); // Update the wishlist state
  };

  const isInWishlist = item => {
    return wishlist.hasOwnProperty(item.id); // Check if the item id exists in the wishlist
  };

  const {item} = route.params;

  const addItem = item => {
    dispatch(addItemToCart(item));
  };
  const navigateToDetails = () => {
    navigation.navigate('Details', {
      item,
      name: item.name,
      image: item.image,
      image2: item.image2,
      image3: item.image3,
      image4: item.image4,
      image5: item.image5,
      category: item.category, // Assuming you have a category property in your item object
      tags: item.tags,
      set: item.set, // Assuming you have a set property in your item object
    });
  };

  return (
    <TouchableOpacity style={styles.productItem} onPress={navigateToDetails}>
      <View style={styles.touchableContent}>
        <View style={styles.productImageContainer}>
          <Image style={styles.productImage} source={item.image} />
          <Text style={styles.productName}>{item.name}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Price: {item.price}</Text>
          <Text style={styles.detailText}>Tags: {item.tags}</Text>
          <Text style={styles.detailText}>Notes: {item.disription}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity
                  onPress={() => toggleWishlist(item)} // Toggle wishlist status
                  style={[
                    styles.button,
                    isInWishlist(item) && {backgroundColor: '#FF817E'}, // Change button style if item is in wishlist
                  ]}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../../../assets/heart.png')}
                  />
                  <Text>WISHLIST</Text>
                </TouchableOpacity>
        <TouchableOpacity style={styles.buttonqty}>
          <Image
            style={{height: 20, width: 20}}
            source={require('../../../assets/qty.png')}
          />
          <Text>ADD QTY</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productItem: {
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 10,
  },
  touchableContent: {
    width: '100%', // Make the touchable content take full width
  },
  productImageContainer: {
    position: 'relative',
    width: '50%', // Make the image take 50% of the touchable content's width
  },
  productImage: {
    width: '100%', // Ensure the image takes full width of its container
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 5,
    marginLeft: 5,
  },
  detailsContainer: {
    width: '50%', // Make the details take 50% of the touchable content's width
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  buttonqty: {
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
});

export default AllCategoriesListed;
