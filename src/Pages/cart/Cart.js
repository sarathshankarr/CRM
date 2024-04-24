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
import {
  addToPending,
  removeFromCart,
  updateCartItem,
} from '../../redux/actions/Actions';
import Clipboard from '@react-native-clipboard/clipboard';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useNavigation} from '@react-navigation/native';
import CustomDropDown from '../../components/CustomDropDown';

const Cart = () => {
  const [inputValues, setInputValues] = useState({}); // Move inside Cart component
  const cartItems = useSelector(state => state.cartItems);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selatedDate, setSelectedDate] = useState('Expexted Delivery Date');
  const [isModalVisible, setModalVisible] = useState(false);

  const totalItems = cartItems.length;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handlePlaceOrder = () => {
    console.log('Placing order...');
    console.log('Cart items:', cartItems);
    navigation.navigate('Order', {
      screen: 'Pending',
      params: {cartItems: cartItems},
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

  const handleRemoveItem = itemIndex => {
    dispatch(removeFromCart(itemIndex));
  };

  const handleQuantityChange = (index, field, text) => {
    const currentItem = cartItems[index];
    const updatedInputValue = {...currentItem.inputValue};
    updatedInputValue[field] = text.trim() !== '' ? text.trim() : undefined;
    dispatch(updateCartItem(index, 'inputValue', updatedInputValue));
    setInputValues(updatedInputValue); // Update inputValue state
  };

  const copyValueToClipboard = index => {
    // console.log('Copying value to clipboard...');
    const copiedText =
      cartItems[index]?.inputValue[
        Object.keys(cartItems[index]?.inputValue)[0]
      ] || '';
    // console.log('Copied text:', copiedText);
    Clipboard.setString(copiedText);

    const updatedInputValue = {};
    for (const size in cartItems[index]?.inputValue) {
      updatedInputValue[size] = copiedText;
    }

    const updatedCartItem = {
      ...cartItems[index],
      inputValue: updatedInputValue,
    };
    console.log('Updated cart item:', updatedCartItem);

    dispatch(updateCartItem(index, 'inputValue', updatedCartItem.inputValue));
    setInputValues(updatedCartItem.inputValue); // Update inputValue state
  };

  const totalQty = cartItems.reduce((total, item) => {
    const quantities = Object.values(item.inputValue).filter(
      qty => qty !== undefined,
    );
    const sum = quantities.reduce((acc, curr) => acc + parseInt(curr), 0);
    return total + sum;
  }, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = parseInt(item.price) || 0;
    const quantities = Object.values(item.inputValue).filter(
      qty => qty !== undefined,
    );
    const totalQuantity = quantities.reduce(
      (acc, curr) => acc + parseInt(curr),
      0,
    );
    return total + itemPrice * totalQuantity;
  }, 0);

  return (
    <View style={{flex: 1,backgroundColor:"#fff"}}>
      <View style={{marginVertical:10,backgroundColor:"#fff"}}>
        <CustomDropDown />
      </View>
      <ScrollView style={style.container}>
        <View style={style.header}>
          <Text style={style.txt}>Total Items: {cartItems.length}</Text>
        </View>
        {cartItems.map((item, index) => (
          <View key={index} style={{marginBottom: 20}}>
            <View style={style.imgContainer}>
              <TouchableOpacity style={style.itemContainer}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {item.imageUrls.length > 0 && (
                    <Image
                      source={{uri: item.imageUrls[0]}}
                      style={{
                        width: 100,
                        height: 100,
                        resizeMode: 'cover',
                        margin: 5,
                      }}
                    />
                  )}
                </View>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  {item.styleDesc}
                </Text>
              </TouchableOpacity>
              <View style={style.buttonsContainer}>
                <TouchableOpacity>
                  <Image
                    style={style.buttonIcon}
                    source={require('../../../assets/edit.png')}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => {
                    navigation.navigate("Add Note")
                  }}>
                    <Image
                      style={style.buttonIcon}
                      source={require('../../../assets/save.png')}
                    />
                  </TouchableOpacity> */}
                <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                  <Image
                    style={style.buttonIcon}
                    source={require('../../../assets/del.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={style.sizehead}>
              <View style={{flex: 0.7}}>
                <Text style={{marginLeft: 10}}>COLOR/SIZE</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text>QUANTITY</Text>
              </View>
              <View style={{flex: 0.4}}>
                <Text>PRICE</Text>
              </View>
              <TouchableOpacity onPress={() => copyValueToClipboard(index)}>
                <Image
                  style={{height: 25, width: 25, marginRight: 10}}
                  source={require('../../../assets/copy.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: 10, marginVertical: 5}}>
              <Text style={{color: '#000', fontWeight: 'bold'}}>
                {item.styleName}
              </Text>
            </View>
            {Object.entries(item.inputValue).map(([size, quantity], idx) => (
              <View key={idx}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    justifyContent: 'space-between',
                    paddingVertical: 6,
                  }}>
                  <View style={{flex: 0.4}}>
                    <Text>Size - {size}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <TextInput
                      value={quantity !== undefined ? quantity.toString() : ''}
                      onChangeText={text =>
                        handleQuantityChange(index, size, text)
                      }
                      style={{
                        borderBottomWidth: 1,
                        borderColor: 'gray',
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginRight: 10,
                        flex: 0.3,
                        textAlign: 'center',
                      }}
                    />
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text>{item.price}</Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: 'gray',
                    marginTop: 4,
                  }}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={showDatePicker}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{paddingVertical: 10}}>
              <Text style={{marginLeft: 10}}>{selatedDate}</Text>
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
          <TextInput style={{marginLeft: 10}} placeholder="Add Note" />
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            paddingVertical: 10,
          }}></View>
      </ScrollView>
      
      <View style={{backgroundColor: '#fff'}}>
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

        {/* <TouchableOpacity onPress={toggleModal} style={style.plusButton}>
          <Image
            style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center' }}
            source={require('../../../assets/plus.png')}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={handlePlaceOrder}
          style={{
            borderWidth: 1,
            borderColor: 'green',
            backgroundColor: 'green',
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
              <TextInput style={style.input} placeholder="Customer Name" />
              <TextInput style={style.input} placeholder="Address" />
              <TextInput style={style.input} placeholder="Gst Number" />
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
    justifyContent: 'center',
    paddingLeft: 20,
    marginHorizontal: 15,
  },
  sizehead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 5,
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
  plusButton: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
export default Cart;
