import React, {useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addToPending, removeFromCart, updateCartItem} from '../../redux/actions/Actions';
import Clipboard from '@react-native-clipboard/clipboard';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cartItems);
  const dispatch = useDispatch();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selatedDate, setSelectedDate] = useState('Expexted Delivery Date');
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handlePlaceOrder = () => {
    console.log('Placing order...');
    console.log('Cart items:', cartItems);
    
    // Navigate to Home screen
    
    // Navigate to the Pending screen within the Order stack
    navigation.navigate('Order', {
      screen: 'Pending',
      params: { cartItems: cartItems },
    });
  };


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = date => {
    console.warn('A date has been picked: ', date);
    const dt = new Date(date);
    const x = dt.toISOString().split('T');
    const x1 = x[0].split('-');
    const formattedDate = x1[2] + '/' + x1[1] + '/' + x1[0];
    const formattedTime = dt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    setSelectedDate(
      'Expected Delivery Date: ' + formattedDate + ' ' + formattedTime,
    );
    hideDatePicker();
  };

  const handleCopyToClipboard = (quantity, field, index) => {
    // Update all quantity fields
    [
      'smallQuantity',
      'mediumQuantity',
      'largeQuantity',
      'extralargeQuantity',
      'doublelargeQuantity',
      'triblelargeQuantity',
      'fivelargeQuantity',
    ].forEach(quantityField => {
      dispatch(updateCartItem(index, quantityField, quantity));
    });

    Clipboard.setString(quantity.toString()); // Set the value to clipboard
  };

  const handleRemoveItem = itemIndex => {
    dispatch(removeFromCart(itemIndex));
  };

  const handleQuantityChange = (index, field, text) => {
    const currentItem = cartItems[index];
    const newQuantity = text === '' ? '' : parseInt(text).toString(); // Convert empty string to actual empty string or integer
    const newCartItem = {...currentItem, [field]: newQuantity};
    dispatch(updateCartItem(index, field, newQuantity));
  };

  const totalItems = cartItems.length;

  const totalQty = cartItems.reduce((total, item) => {
    return (
      total +
      (parseInt(item.extraSmallQuantity) || 0) +
      (parseInt(item.smallQuantity) || 0) +
      (parseInt(item.mediumQuantity) || 0) +
      (parseInt(item.largeQuantity) || 0) +
      (parseInt(item.extralargeQuantity) || 0) +
      (parseInt(item.doublelargeQuantity) || 0) +
      (parseInt(item.triblelargeQuantity) || 0) +
      (parseInt(item.fivelargeQuantity) || 0)
    );
  }, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    return (
      total +
      parseInt(item.price) *
        ((parseInt(item.extraSmallQuantity) || 0) +
          (parseInt(item.smallQuantity) || 0) +
          (parseInt(item.mediumQuantity) || 0) +
          (parseInt(item.largeQuantity) || 0) +
          (parseInt(item.extralargeQuantity) || 0) +
          (parseInt(item.doublelargeQuantity) || 0) +
          (parseInt(item.triblelargeQuantity) || 0) +
          (parseInt(item.fivelargeQuantity) || 0))
    );
  }, 0);

  return (
    <View style={{flex: 1}}>
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
                  <TouchableOpacity onPress={()=>{
                    navigation.navigate("Add Note")
                  }}>
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
                      value={item.extraSmallQuantity.toString()} // Assuming extraSmallQuantity is a string
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
                  <View style={{flex: 0.8}}>
                    <Text>{item.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={() =>
                      handleCopyToClipboard(
                        item.extraSmallQuantity,
                        'extraSmallQuantity',
                        index,
                      )
                    }>
                    <Image
                      style={{height: 20, width: 20}}
                      source={require('../../../assets/copy.png')}
                    />
                  </TouchableOpacity>
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
                        text =>
                          handleQuantityChange(index, 'smallQuantity', text) // Use 'smallQuantity' as the field parameter
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
                        text =>
                          handleQuantityChange(index, 'mediumQuantity', text) // Use 'smallQuantity' as the field parameter
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
                        text =>
                          handleQuantityChange(index, 'largeQuantity', text) // Use 'smallQuantity' as the field parameter
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
                      value={item.extralargeQuantity?.toString()}
                      onChangeText={
                        text =>
                          handleQuantityChange(
                            index,
                            'extralargeQuantity',
                            text,
                          ) // Use 'smallQuantity' as the field parameter
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
                      value={item.doublelargeQuantity?.toString()}
                      onChangeText={
                        text =>
                          handleQuantityChange(
                            index,
                            'doublelargeQuantity',
                            text,
                          ) // Use 'smallQuantity' as the field parameter
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
                      value={
                        item && item.triblelargeQuantity !== undefined
                          ? item.triblelargeQuantity.toString()
                          : ''
                      }
                      onChangeText={text =>
                        handleQuantityChange(index, 'triblelargeQuantity', text)
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
                      value={
                        item && item.fivelargeQuantity
                          ? item.fivelargeQuantity.toString()
                          : ''
                      }
                      onChangeText={text =>
                        handleQuantityChange(index, 'fivelargeQuantity', text)
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
                <View>
                  <Text style={style.txt}>Total: {totalItems}</Text>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      <View style={{backgroundColor: '#fff'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={showDatePicker}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{paddingVertical: 10}}>
              <Text>{selatedDate}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
            }}
            onPress={showDatePicker}>
            <Image
              style={style.dateIcon}
              source={require('../../../assets/date.png')}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            marginTop: 10,
          }}></View>
        <View>
          <TextInput placeholder="Add Note" />
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            paddingVertical: 10,
          }}></View>

        <View style={style.bottomContainer}>
          <View style={{flex: 1}}>
            <Text>Total Qty: {totalQty}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text>Total Set: {totalItems}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text>Total Amt: {totalPrice}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleModal} style={style.plusButton}>
        <Image
          style={{height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}}
          source={require('../../../assets/plus.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlaceOrder}
  style={{
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: 'green',
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
  }}>
  <Text
    style={{
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
    }}>
    PLACE ORDER
  </Text>
</TouchableOpacity>




        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
     <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          toggleModal();
        }}>
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={style.modalTitle}>Customer Details</Text>
            <TextInput
              style={style.input}
              placeholder="Customer Name"
            />
            <TextInput
              style={style.input}
              placeholder="Address"
            />
            <TextInput
              style={style.input}
              placeholder="Gst Number"
            />
            <TouchableOpacity
              style={style.saveButton}
              onPress={() => {
                // Logic to save customer details
                toggleModal();
              }}>
              <Text style={style.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </View>
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
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    backgroundColor: '#fff',
  },
  dateIconContainer: {
    justifyContent: 'center', // Center the icon vertically
    paddingLeft: 20, // Add some padding to the left
    marginHorizontal: 15,
  },
  dateIcon: {
    height: 25,
    width: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5, // Add elevation for shadow on Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  plusButton:{
    alignItems:'center',
    justifyContent:'center',
    textAlign:'center'
  }
});

export default Cart;
