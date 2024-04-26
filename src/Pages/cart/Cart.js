import React, {useEffect, useState} from 'react';
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
import ModalComponent from '../../components/ModelComponent';
import {API} from '../../config/apiConfig';
import axios from 'axios';

const Cart = () => {
  const [inputValues, setInputValues] = useState({}); // Move inside Cart component
  const cartItems = useSelector(state => state.cartItems);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selatedDate, setSelectedDate] = useState('Expexted Delivery Date');
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [comments, setComments] = useState('');
  const [shipDate, setShipDate] = useState(null)
  
  const handleCommentsChange = text => {
    setComments(text);
  };

  useEffect(() => {
    if (clicked) {
      getCustomersDetails();
    }
  }, [clicked]);

  const getCustomersDetails = () => {
    const companyId = 1; // Company ID
    const apiUrl = `${API.ADD_CUSTOMER_LIST}/${companyId}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        setCustomers(response?.data?.response?.customerList || []);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleDropdownClick = () => {
    setClicked(!clicked);
  };

  const handleCustomerSelection = (firstName, lastName) => {
    setSelectedCustomer(`${firstName} ${lastName}`);
    setClicked(false);
  };

  const totalItems = cartItems.length;

  console.log('cart', cartItems);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  console.log('selecteditem', selectedItem);

  const PlaceAddOrder = () => {
    
    const apiUrl = `${API.ADD_ORDER_DATA}`;
  
    const currentDate = new Date().toISOString().split('T')[0];
  
    const selectedCustomerObj = customers.find(customer => {
      return `${customer.firstName} ${customer.lastName}` === selectedCustomer;
    });
  
    const customerId = selectedCustomerObj ? selectedCustomerObj.customerId : '';
    const selectedShipDate = shipDate || currentDate;

    const orderLineItems = cartItems.map(item => {
      const size = Object.keys(item.inputValue)[0]; // Assuming size is the first key in inputValue object
      return {
        styleId: item.styleId,
        colorId: item.colorId,
        size: size,
        gsCode: '8907535008964',
        qty: totalQty.toString(),
        unitPrice: '12',
        gross: '144',
        discountPercentage: '0',
        discountAmount: '0',
        gst: '0',
        total: totalPrice.toString(),
        itemStatus: 'OPEN',
        locationId: '1',
      };
    });
  console.log(orderLineItems)
    axios
      .post(
        apiUrl,
        {
          orderDate: currentDate,
          shipDate: selectedShipDate,
          customerId: customerId,
          shippingAddressId: '22',
          billingAddressId: '23',
          comments: comments,
          orderStatus: 'PENDING',
          totalQty: totalQty.toString(),
          totalGst: '0',
          totalDiscount: '0',
          transportCost: '0',
          lumpsumDiscount: '0',
          totalAmount: totalPrice.toString(),
          createBy: 1,
          orderSource: 'ONLINE',
          orderLineItems: orderLineItems,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${global.userData.access_token}`,
          },
        },
      )
      .then(response => {
        // Handle success
        const ordersList = response?.data?.response?.ordersList || [];
        console.log('response', response.data.response.ordersList);
        navigation.navigate('Home');
      })
      .catch(error => {
        // Handle error
        if (error.response && error.response.status === 401) {
          console.error('Token expired or invalid. Need to reauthenticate.');
          // You might want to handle token expiration here
        } else {
          console.error('Error:', error);
        }
      });
  };
  
  

  const openModal = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handlePlaceOrder = () => {
    console.log('Placing order...');
    console.log('Cart items:', cartItems);
    navigation.navigate('Order', {
      screen: 'Pending',
      params: {cartItems: cartItems},
    });
  };

  const handleInputValueChange = (size, value) => {
    setInputValues(prevState => ({
      ...prevState,
      [size]: value,
    }));
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = date => {
    console.warn('A date has been picked: ', date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    setSelectedDate('Expected Delivery Date: ' + formattedDate);
    hideDatePicker();
    setShipDate(date.toISOString().split('T')[0]);
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
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{marginVertical: 10, backgroundColor: '#fff'}}>
        <View style={{}}>
          <TouchableOpacity
            style={{
              width: '90%',
              height: 50,
              borderRadius: 10,
              borderWidth: 0.5,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
            }}
            onPress={handleDropdownClick}>
            <Text style={{fontWeight: '600'}}>
              {selectedCustomer || 'Customer'}
            </Text>
            <Image
              source={require('../../../assets/dropdown.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
          {clicked && (
            <View
              style={{
                elevation: 5,
                height: 300,
                alignSelf: 'center',
                width: '90%',
                backgroundColor: '#fff',
                borderRadius: 10,
              }}>
              {customers.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: '100%',
                    height: 50,
                    justifyContent: 'center',
                    borderBottomWidth: 0.5,
                    borderColor: '#8e8e8e',
                  }}
                  onPress={() => {
                    handleCustomerSelection(item.firstName, item.lastName);
                    console.log(item);
                  }}>
                  <Text style={{fontWeight: '600', marginHorizontal: 15}}>
                    {item.firstName} {item.lastName}
                  </Text>
                  {/* <Text>{item.phoneNumber}</Text> */}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
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
                <TouchableOpacity onPress={() => openModal(item)}>
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
            <Text>colorId - {item.colorId}</Text>
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
                    {console.log('Price for item:', item.price)}
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
          <TextInput
            style={{marginLeft: 10}}
            placeholder="Enter comments"
            value={comments}
            onChangeText={handleCommentsChange}
          />
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

        <TouchableOpacity
          onPress={PlaceAddOrder}
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

        <ModalComponent
          modalVisible={modalVisible}
          closeModal={closeModal}
          selectedItem={selectedItem}
          inputValues={inputValues}
          onInputValueChange={handleInputValueChange} // Pass the function to handle input value changes
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
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
