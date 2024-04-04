import React, {useState} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {removeItemFromCart} from '../../redux/action/Action';
import {useNavigation} from '@react-navigation/native';

const Cart = () => {
  const navigation = useNavigation();
  const items = useSelector(state => state);
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false); // State to track removal process

  const removeItem = itemId => {
    // Check if removal process is already in progress
    if (!isRemoving) {
      setIsRemoving(true); // Set state to indicate removal process start
      dispatch(removeItemFromCart(itemId));
      setIsRemoving(false); // Reset state after removal process completes
    }
  };

  return (
    <View style={style.container}>
      <Text>Order</Text>
      <FlatList
        data={items}
        renderItem={({item}) => (
          <View key={item.id}>
            <Image style={style.img} source={item.image} />
            <Text>{item.name}</Text>
            <TouchableOpacity>
              <Image style={{height:25,width:25}} source={require('../../../assets/edit.png')}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={{height:25,width:25}} source={require('../../../assets/save.png')}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                removeItem(item.id);
              }}>
                <Image style={{height:25,width:25}} source={require('../../../assets/del.png')}/>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => `${item.id}_${index}`}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  img:{
    height: 70, 
      width: 70
  }
});
export default Cart;
