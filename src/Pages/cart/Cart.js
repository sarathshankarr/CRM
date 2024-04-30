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
  const [inputValues, setInputValues] = useState({});
  const cartItems = useSelector(state => state.cartItems);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selatedDate, setSelectedDate] = useState('Expexted Delivery Date');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [comments, setComments] = useState('');
  const [shipDate, setShipDate] = useState(null);
  const [customerLocations, setCustomerLocations] = useState([]);
  const [fromToClicked, setFromToClicked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [shipFromToClicked, setShipFromToClicked] = useState(false);
  const [selectedShipLocation, setSelectedShipLocation] = useState('');

  const handleCommentsChange = text => {
    setComments(text);
  };

  useEffect(() => {
    if (clicked) {
      getCustomersDetails();
    }
  }, [clicked]);

  const getCustomerLocations = customerId => {
    const custometType = 1;
    const companyId = 1;

    console.log('customerId:', customerId);

    if (!customerId) {
      console.error('customerId is undefined or null');
      return;
    }

    const apiUrl = `${API.GET_CUSTOMER_LOCATION}/${customerId}/${custometType}/${companyId}`;

    console.log('API URL:', apiUrl);

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        setCustomerLocations(response.data);
        console.log('location response', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        if (error.response && error.response.status === 401) {
        }
      });
  };

  const handleFromDropdownClick = () => {
    setFromToClicked(!fromToClicked);
    if (!fromToClicked) {
      getCustomerLocations(selectedCustomerId);
    }
  };

  const handleShipDropdownClick = () => {
    setShipFromToClicked(!shipFromToClicked);
    if (!shipFromToClicked) {
      getCustomerLocations(selectedCustomerId);
    }
  };

  const getCustomersDetails = () => {
    const companyId = 1;
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

  const handleCustomerSelection = (firstName, lastName, customerId) => {
    setSelectedCustomer(`${firstName} ${lastName}`);
    setClicked(false);
    setSelectedCustomerId(customerId);
    getCustomerLocations(customerId);
  };

  const handleLocationSelection = locationName => {
    setSelectedLocation(locationName);
    setFromToClicked(false);
  };

  const handleShipLocation = locationName => {
    setSelectedShipLocation(locationName);
    setShipFromToClicked(false);
  };

  const totalItems = cartItems.length;

  // console.log('cart', cartItems);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  // console.log('selecteditem', selectedItem);

  const PlaceAddOrder = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const selectedCustomerObj = customers.find(customer => {
      return `${customer.firstName} ${customer.lastName}` === selectedCustomer;
    });

    const customerId = selectedCustomerObj
      ? selectedCustomerObj.customerId
      : '';

    const billingAddressId = selectedLocation
      ? selectedLocation.locationId.toString()
      : ''; // Empty string if no billing location selected

    const shippingAddressId = selectedShipLocation
      ? selectedShipLocation.locationId.toString()
      : ''; // Empty string if no shipping location selected
    const selectedShipDate = shipDate || currentDate;

    console.log('customerId:', customerId);
    console.log('selectedBillingLocation:', selectedLocation);
    console.log('selectedShippingLocation:', selectedShipLocation);
    console.log('billingAddressId:', billingAddressId);
    console.log('shippingAddressId:', shippingAddressId);

    const requestData = {
      totalAmount: totalPrice.toString(),
      totalDiscount: '0',
      totalDiscountSec: '0',
      totalDiscountThird: '0',
      totalGst: '0',
      totalQty: totalQty.toString(),
      orderStatus: 'Open',
      comments: comments,
      customerId: customerId,
      billingAddressId: selectedLocation.locationId.toString(), // Set billingAddressId with selectedLocation's locationId
      shippingAddressId: selectedShipLocation.locationId.toString(), // Set shippingAddressId with selectedShipLocation's locationId
      shipDate: selectedShipDate,
      orderDate: currentDate,
      companyLocId: '0',
      agentId: '0',
      subAgentId: '0',
      orderLineItems: cartItems.map(item => ({
        qty: totalQty.toString(),
        styleId: item.styleId,
        colorId: item.colorId,
        gscodeMapId: 42,
        sizeDesc: item.sizeDesc,
        gsCode: '8907536002462',
        availQty: totalQty.toString(),
        price: totalPrice.toString(),
        gross: '9660',
        discountPercentage: '0',
        discountAmount: '0',
        gst: 5,
        total: totalPrice.toString(),
        itemStatus: 'OPEN',
        pcqty: '0',
        pack_qty: 0,
        sizeId: 0,
        packageId: 0,
        cedgeFlag: '0',
        cedgeStyleId: 0,
        discountPercentageSec: 0.0,
        discountPercentageThird: 200.0,
        closeFlag: 0,
        statusFlag: 0,
        poId: 0,
      })),
      comments: comments,
      customerType: 1,
      distributorId: 0,
      invoiceNo: '',
      deliveryNote: '',
      mop: '',
      refNo: '',
      refDate: '',
      otherRefs: '',
      buyersNo: '',
      dispatchNo: '',
      delNoteDate: '',
      dispatch: 1,
      retailerId: '',
      tsiId: 0,
      approveFlag: 0,
      returnReasonId: 0,
      returnRemarks: '',
      appComments: '',
      gTranspExp: 0,
      gOtherExp: 0,
      companyId: '1',
    };

    axios
      .post(API.ADD_ORDER_DATA, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        // console.log('Order placement response:', response);
        dispatch({type: 'CLEAR_CART'});
        navigation.navigate('Home');
      })

      .catch(error => {
        console.error('Error placing order:', error);
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

  // const handlePlaceOrder = () => {
  //   console.log('Placing order...');
  //   console.log('Cart items:', cartItems);
  //   navigation.navigate('Order', {
  //     screen: 'Pending',
  //     params: {cartItems: cartItems},
  //   });
  // };

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
    // console.log('Updated cart item:', updatedCartItem);

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
        <View style={{marginHorizontal: 10, marginVertical: 2}}>
          <Text style={{color: '#000', fontWeight: 'bold'}}>Customers</Text>
        </View>
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
                    handleCustomerSelection(
                      item.firstName,
                      item.lastName,
                      item.customerId,
                    );
                    console.log(item);
                  }}>
                  <Text style={{fontWeight: '600', marginHorizontal: 15}}>
                    {item.firstName} {item.lastName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={handleFromDropdownClick}
            style={{
              width: '90%',
              height: 50,
              borderRadius: 10,
              borderWidth: 0.5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              marginLeft: 18,
            }}>
            <Text>{selectedLocation.locationName || 'Billing to'}</Text>
            <Image
              source={require('../../../assets/dropdown.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
          {fromToClicked && (
            <View
              style={{
                elevation: 5,
                height: 300,
                alignSelf: 'center',
                width: '85%',
                backgroundColor: '#fff',
                borderRadius: 10,
                marginLeft: 15,
              }}>
              {/* Here you can render your dropdown content */}
              <ScrollView>
                {customerLocations.map(location => (
                  <TouchableOpacity
                    key={location.locationId}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}
                    onPress={() => handleLocationSelection(location)}>
                    <Text>{location.locationName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={handleShipDropdownClick}
            style={{
              width: '90%',
              height: 50,
              borderRadius: 10,
              borderWidth: 0.5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              marginRight: 18,
            }}>
            <Text>{selectedShipLocation.locationName || 'Ship to'}</Text>
            <Image
              source={require('../../../assets/dropdown.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
          {shipFromToClicked && (
            <View
              style={{
                elevation: 5,
                height: 300,
                alignSelf: 'center',
                width: '85%',
                backgroundColor: '#fff',
                borderRadius: 10,
                marginRight: 17,
              }}>
              {/* Here you can render your dropdown content */}
              <ScrollView>
                {customerLocations.map(location => (
                  <TouchableOpacity
                    key={location.locationId}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}
                    onPress={() => handleShipLocation(location)}>
                    <Text>{location.locationName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
                    {/* {console.log('Price for item:', item.price)} */}
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
            placeholderTextColor="#000"
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
