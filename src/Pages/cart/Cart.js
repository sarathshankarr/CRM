import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {removeFromCart, updateCartItem} from '../../redux/actions/Actions';

const Cart = () => {
  const cartItems = useSelector(state => state.cartItems);
  const dispatch = useDispatch();

  const handleRemoveItem = itemIndex => {
    dispatch(removeFromCart(itemIndex));
  };
  const handleQuantityChange = (index, field, text) => {
    // Convert text to a number
    const quantity = parseInt(text, 10);
    if (!isNaN(quantity)) {
      // Dispatch action to update the cart item
      dispatch(updateCartItem(index, field, quantity));
    }
  };

  const totalItems = cartItems.length;

  return (
    <ScrollView style={style.container}>
      <View style={style.header}>
        <Text style={style.txt}>Total Items: {totalItems}</Text>
      </View>
      {cartItems &&
        cartItems.map((item, index) => (
          <View key={index}>
            <View style={style.imgContainer}>
              <TouchableOpacity style={style.itemContainer}>
                <Image source={item.image} style={style.image} />
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  {' '}
                  {item.name}
                </Text>
              </TouchableOpacity>
              <View style={style.buttonsContainer}>
                <TouchableOpacity>
                  <Image
                    style={style.buttonIcon}
                    source={require('../../../assets/edit.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={style.buttonIcon}
                    source={require('../../../assets/save.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                  <Image
                    style={style.buttonIcon}
                    source={require('../../../assets/del.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'lightgray',
                paddingVertical: 5,
              }}>
              <View style={{flex: 1}}>
                <Text style={{marginLeft: 10}}>COLOR/SIZE</Text>
              </View>
              <View style={{flex: 1}}>
                <Text>QUANTITY</Text>
              </View>
              <View style={{flex: 1}}>
                <Text>PRICE</Text>
              </View>
            </View>

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>.Extra Small</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.extraSmallQuantity.toString()}
                    onChangeText={text =>
                      handleQuantityChange(index, 'extraSmallQuantity', text)
                    }
                    keyboardType="numeric"
                  />
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>.Extra Small</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.extraSmallQuantity.toString()}
                    onChangeText={text =>
                      handleQuantityChange(index, 'extraSmallQuantity', text)
                    }
                    keyboardType="numeric"
                  />
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>Small Quantity:</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.smallQuantity.toString()}
                    onChangeText={
                      text => handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
                    }
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>


<View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>Medium Quantity:</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.mediumQuantity.toString()}
                    onChangeText={
                      text => handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
                    }
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>Large Quantity:</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.largeQuantity.toString()}
                    onChangeText={
                      text => handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
                    }
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
             
             
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>Extra Large Quantity:</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.extralargeQuantity.toString()}
                    onChangeText={
                      text => handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
                    }
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
             
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>2x Large Quantity:</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.doublelargeQuantity.toString()}
                    onChangeText={
                      text => handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
                    }
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>3x Large Quantity:</Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.doublelargeQuantity.toString()}
                    onChangeText={
                      text => handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
                    }
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
             
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text>5x Large Quantity: </Text>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center'}}>
                  <TextInput
                    style={{alignItems: 'center', marginLeft: 17}}
                    value={item.fivelargeQuantity.toString()}
                    onChangeText={
                      text => handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
                    }
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                      marginRight: 50,
                    }}></View>
                </View>
                <View style={{flex: 1}}>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
             

              
            </View>
          </View>
        ))}
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    marginTop: 15,
  },
  txt: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  imgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  buttonIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
});

export default Cart;
