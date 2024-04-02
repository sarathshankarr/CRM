import React from 'react';
import {Text, View, FlatList, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {removeItemFromCart} from '../../redux/action/Action';
import {useNavigation} from '@react-navigation/native';

const Cart = () => {
  const navigation = useNavigation();
  const items = useSelector(state => state);
  const dispatch = useDispatch();
  const removeItem = index => {
    dispatch(removeItemFromCart(index));
  };

  return (
    <View>
      <Text>Cart</Text>
      <FlatList
        data={items}
        renderItem={({item, index}) => (
          <View>
            <Text>Product Name: {item.name}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Tags: {item.tags}</Text>
            <Text>Notes: {item.disription}</Text>
            <Image style={{height: 50, width: 50}} source={item.image} />
            <TouchableOpacity
              onPress={() => {
                removeItem(index);
              }}>
              <Text>DEL</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Cart;
