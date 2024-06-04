import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToPending,
  removeFromCart,
  setLoggedInUser,
  setUserRole,
  updateCartItem,
} from '../../redux/actions/Actions';
import Clipboard from '@react-native-clipboard/clipboard';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useNavigation} from '@react-navigation/native';
import ModalComponent from '../../components/ModelComponent';
import {API} from '../../config/apiConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = () => {
  const userRole = useSelector(state => state.userRole) || '';
  const loggedInUser = useSelector(state => state.loggedInUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [initialSelectedCompany, setInitialSelectedCompany] = useState(null);

  const selectedCompany = useSelector(state => state.selectedCompany);
  const [isLoading, setIsLoading] = useState(false);

  const [inputValuess, setInputValuess] = useState({});
  const cartItems = useSelector(state => state.cartItems);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selatedDate, setSelectedDate] = useState('Expected delivery date');
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialSelectedCompany = async () => {
      try {
        const initialCompanyData = await AsyncStorage.getItem(
          'initialSelectedCompany',
        );
        if (initialCompanyData) {
          const initialCompany = JSON.parse(initialCompanyData);
          setInitialSelectedCompany(initialCompany);
          console.log('Initial Selected Company:', initialCompany);
        }
      } catch (error) {
        console.error('Error fetching initial selected company:', error);
      }
    };

    fetchInitialSelectedCompany();
  }, []);

  const companyId = selectedCompany
    ? selectedCompany.id
    : initialSelectedCompany?.id;

  useEffect(() => {
    console.log('Companyyyyyyyyy ID:', companyId);
  }, [companyId]);

  useEffect(() => {
    // Fetch user role from AsyncStorage
    const fetchUserRole = async () => {
      try {
        const storedUserRole = await AsyncStorage.getItem('userRole');
        console.log('Stored user role:', storedUserRole);
        if (storedUserRole) {
          dispatch(
            setUserRole(
              typeof storedUserRole === 'string'
                ? storedUserRole
                : JSON.parse(storedUserRole),
            ),
          );
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const [selectedCustomerLocationDetails, setSelectedCustomerLocationDetails] =
    useState(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const [locationInputValues, setLocationInputValues] = useState({});

  const toggleLocationModal = () => {
    setIsLocationModalVisible(!isLocationModalVisible);
  };

  const [inputValues, setInputValues] = useState({
    firstName: '',
    phoneNumber: '',
    whatsappId: '',
    cityOrTown: '',
    state: '',
    country: '',
  });

  const handleSaveButtonPress = () => {
    if (
      !inputValues.firstName ||
      !inputValues.phoneNumber ||
      !inputValues.cityOrTown ||
      !inputValues.state ||
      !inputValues.country
    ) {
      Alert.alert('Alert', 'Please fill in all mandatory fields');
      return;
    }
    addCustomerDetails();
    toggleModal();
  };

  useEffect(() => {
    // Fetch user data from AsyncStorage
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          console.log('Stored User Data:', userData);
          // Dispatch action to set user data in Redux
          dispatch(setLoggedInUser(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const addCustomerDetails = () => {
    const requestData = {
      firstName: inputValues.firstName,
      lastName: '',
      phoneNumber: inputValues.phoneNumber,
      whatsappId: inputValues.whatsappId,
      emailId: 'supervisor381user@codeverse.in',
      action: 'ADD',
      createBy: 1,
      createOn: new Date().toISOString(),
      modifiedBy: 1,
      modifiedOn: new Date().toISOString(),
      houseNo: '200 - F',
      street: 'First Lane',
      locality: 'Square Street',
      cityOrTown: inputValues.cityOrTown,
      state: inputValues.state,
      country: inputValues.country,
      pincode: '500049',
      pan: 'AG818EH2U1',
      gstNo: 'HUVYYVYH8',
      creditLimit: 0,
      paymentReminderId: 0,
      companyId: companyId,
    };

    axios
      .post(API.ADD_CUSTOMER_DETAILS, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        const newCustomer = response.data.response.customerList[0];
        console.log('ADD_CUSTOMER_DETAILS', newCustomer);

        // Update the selected customer details and ID
        setSelectedCustomerDetails([newCustomer]);
        setSelectedCustomerId(newCustomer.customerId);

        // Fetch and set the customer locations for the new customer
        getCustomerLocations(newCustomer.customerId);

        // Close the modal
        toggleModal();
      })
      .catch(error => {
        console.error('Error adding customer:', error);
      });
  };

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

    console.log('customerId:', customerId);

    if (!customerId) {
      console.error('customerId is undefined or null');
      return;
    }

    const apiUrl = `${API.GET_CUSTOMER_LOCATION}/${customerId}/${custometType}/${companyId}`;
    console.log('Fetching customer locations with companyId:', companyId);

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
    const apiUrl = `${API.ADD_CUSTOMER_LIST}/${companyId}`;
    setIsLoading(true); // Set loading to true before making the request
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        setCustomers(response?.data?.response?.customerList || []);
        setIsLoading(false); // Set loading to false after receiving the response
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false); // Set loading to false in case of error
      });
  };

  const handleDropdownClick = () => {
    setClicked(!clicked);
  };

  const handleCustomerSelection = (firstName, lastName, customerId) => {
    setSelectedCustomer(`${firstName} ${lastName}`);
    setClicked(false);
    setSelectedCustomerId(customerId);
    // Reset selected location
    setSelectedLocation('');
    setSelectedShipLocation('');
    getCustomerLocations(customerId);
    const selectedCustomer = customers.find(
      customer => customer.customerId === customerId,
    );
    setSelectedCustomerDetails([selectedCustomer]);
  };

  const handleLocationSelection = location => {
    setSelectedLocation(location.locationName);
    setFromToClicked(false);
  };
  const handleShipLocation = location => {
    setSelectedShipLocation(location.locationName);
    setShipFromToClicked(false);
  };

  const totalItems = cartItems.length;

  // console.log('cart', cartItems);
  // console.log('selecteditem', selectedItem);

  const PlaceAddOrder = () => {
    if (isSubmitting) return; // Prevent multiple submissions

    if (isSubmitting) return;

    if (userRole === 'admin') {
      if (!selectedCustomer) {
        Alert.alert('Alert', 'Please select a customer.');
        return;
      }
    } else if (userRole === 'Distributor' || userRole === 'Retailer') {
      // No alert for Distributor or Retailer
    }
    

    if (!selectedLocation) {
      Alert.alert('Alert', 'Please select a Billing to location.');
      return;
    }

    if (!selectedShipLocation) {
      Alert.alert('Alert', 'Please select a Shipping to location.');
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert('Alert', 'No items selected. Please add items to the cart.');
      return;
    }
    setIsSubmitting(true);

    console.log('loggedInUser:', loggedInUser);
    console.log('userRole:', userRole);

    if (!loggedInUser || !userRole) {
      // Redirect to login screen or handle not logged in scenario
      return;
    }

    console.log('userRole type:', typeof userRole);

    let roleId = ''; // Initialize roleId

    // Check if userRole is an array and not empty
    if (Array.isArray(userRole) && userRole.length > 0) {
      roleId = userRole[0].id; // Using the first id from userRole array
      console.log('roleId from userRole:', roleId);
    } else {
      console.log('userRole is not an array or is empty');
    }

    // Extract roleId from loggedInUser if userRole is not an array or is empty
    if (!roleId && loggedInUser.role && loggedInUser.role.length > 0) {
      roleId = loggedInUser.role[0].id;
      console.log('roleId from loggedInUser:', roleId);
    }

    const selectedCustomerObj = customers.find(customer => {
      return `${customer.firstName} ${customer.lastName}` === selectedCustomer;
    });

    const customerId =
      userRole === 'admin'
        ? selectedCustomerObj
          ? selectedCustomerObj.customerId
          : ''
        : userRole === 'Distributor' || userRole === 'Retailer'
        ? roleId
        : '';

    const currentDate = new Date().toISOString().split('T')[0];

    const billingAddressId =
      selectedLocation && selectedLocation.locationId
        ? selectedLocation.locationId
        : '';

    const shippingAddressId =
      selectedShipLocation && selectedShipLocation.locationId
        ? selectedShipLocation.locationId
        : '';

    const selectedShipDate = shipDate || currentDate;

    console.log('selectedBillingLocation:', selectedLocation);
    console.log('selectedShippingLocation:', selectedShipLocation);
    console.log('billingAddressId:', billingAddressId);
    console.log('shippingAddressId:', shippingAddressId);
    console.log('customerId', customerId);

    const requestData = {
      totalAmount: totalPrice.toString(),
      totalDiscount: '0',
      totalDiscountSec: '0',
      totalDiscountThird: '0',
      totalGst: '0',
      totalQty: totalQty.toString(),
      orderStatus: 'Open',
      comments: comments,
      customerId: userRole === 'admin' ? customerId : roleId, // Use customerId if admin, roleId otherwise
      billingAddressId: billingAddressId,
      shippingAddressId: shippingAddressId,
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
      companyId: companyId,
    };
    axios
      .post(API.ADD_ORDER_DATA, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        dispatch({type: 'CLEAR_CART'});
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Error placing order:', error);
      })
      .finally(() => {
        // Reset loading state after order placement completes
        setIsSubmitting(false);
      });
  };

  const openModal = item => {
    setSelectedItem(item);
    setInputValuess(item.inputValue || {}); // Set to an empty object if item.inputValue is empty
    setModalVisible(true);
  };
  useEffect(() => {
    if (selectedItem) {
      setInputValuess(selectedItem.inputValue || {}); // Set to an empty object if selectedItem.inputValue is empty
      console.log('Input Values:', inputValuess); // Log the inputValues state
    }
  }, [selectedItem]);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleInputValueChange = (size, value) => {
    setInputValuess(prevState => ({
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
    setInputValuess(updatedInputValue); // Update inputValue state
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
    setInputValuess(updatedCartItem.inputValue); // Update inputValue state
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

  const handleSaveLocationButtonPress = () => {
    // Check if any of the mandatory fields are empty
    if (
      !locationInputValues.locationName ||
      !locationInputValues.phoneNumber ||
      !locationInputValues.locality ||
      !locationInputValues.cityOrTown ||
      !locationInputValues.state ||
      !locationInputValues.pincode ||
      !locationInputValues.country
    ) {
      Alert.alert('Alert', 'Please fill in all mandatory fields');
      return;
    }
    addCustomerLocationDetails(); // Call the function to add location details
    toggleLocationModal(); // Close the location modal
    setLocationInputValues({}); // Reset input values after saving
  };

  const addCustomerLocationDetails = () => {
    const requestLocationData = {
      createBy: 1,
      createOn: '2024-05-08T08:31:06.285',
      modifiedBy: 1,
      modifiedOn: '2024-05-08T08:31:06.285',
      locationId: 66,
      locationName: locationInputValues.locationName,
      locationCode: '',
      locationDescription: locationInputValues.locationName,
      parentId: 0,
      customerId: selectedCustomerId,
      status: 0,
      phoneNumber: locationInputValues.phoneNumber,
      emailId: '',
      houseNo: '',
      street: '',
      locality: locationInputValues.locality,
      cityOrTown: locationInputValues.cityOrTown,
      state: locationInputValues.state,
      country: locationInputValues.country,
      pincode: locationInputValues.pincode,
      customerType: 1,
      latitude: null,
      longitude: null,
      fullName: null,
      companyId: companyId,
      locationType: 0,
    };

    axios
      .post(API.ADD_CUSTOMER_LOCATION, requestLocationData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        console.log(
          'ADD_CUSTOMER_LOCATION',
          response.data.response.locationList,
        );
        setSelectedCustomerLocationDetails(response.data.response.locationList);
        toggleLocationModal();

        // Update selected location state
        setSelectedLocation(
          response.data.response.locationList[0].locationName,
        );
        setSelectedShipLocation(
          response.data.response.locationList[0].locationName,
        );
      })
      .catch(error => {
        console.error('Error adding customer:', error);
      });
  };

  useEffect(() => {
    console.log('User Roleeeeee:', userRole);
  }, []); // Run only once when component mounts

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{marginVertical: 10, backgroundColor: '#fff'}}>
          <View style={{marginHorizontal: 10, marginVertical: 2}}>
            <Text style={{color: '#000', fontWeight: 'bold'}}>Customers</Text>
          </View>
          <View>
            {userRole &&
              userRole.toLowerCase &&
              userRole.toLowerCase() === 'admin' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
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
                        {selectedCustomerDetails &&
                        selectedCustomerDetails.length > 0
                          ? `${selectedCustomerDetails[0].firstName} ${selectedCustomerDetails[0].lastName}`
                          : 'Customer'}
                      </Text>

                      <Image
                        source={require('../../../assets/dropdown.png')}
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                    {clicked && (
                      <FlatList
                        data={customers}
                        renderItem={({item, index}) => (
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
                            <Text
                              style={{
                                fontWeight: '600',
                                marginHorizontal: 15,
                              }}>
                              {item.firstName} {item.lastName}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={{
                          elevation: 5,
                          height: 300,
                          alignSelf: 'center',
                          width: '90%',
                          backgroundColor: '#fff',
                          borderRadius: 10,
                        }}
                      />
                    )}
                    {isLoading && ( // Show ActivityIndicator if isLoading is true
                      <ActivityIndicator
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginLeft: -20,
                          marginTop: -20,
                        }}
                        size="large"
                        color="#390050"
                      />
                    )}
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={toggleModal}
                      style={style.plusButton}>
                      <Image
                        style={{
                          height: 30,
                          width: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        source={require('../../../assets/plus.png')}
                      />
                    </TouchableOpacity>
                  </View>
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
              {/* <Text>{selectedLocation.locationName || 'Billing to'}</Text> */}
              <Text style={{fontWeight: '600'}}>
                {selectedLocation.length > 0
                  ? `${selectedLocation}`
                  : 'Billing to'}
              </Text>
              <Image
                source={require('../../../assets/dropdown.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
            {fromToClicked && (
              <View
                style={{
                  elevation: 5,
                  height: 175,
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
                marginLeft: 5,
              }}>
              {/* <Text>{selectedShipLocation.locationName || 'Shiping to'}</Text> */}
              <Text style={{fontWeight: '600'}}>
                {selectedShipLocation.length > 0
                  ? `${selectedShipLocation}`
                  : 'Shipping to'}
              </Text>
              <Image
                source={require('../../../assets/dropdown.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
            {shipFromToClicked && (
              <View
                style={{
                  elevation: 5,
                  height: 175,
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
          <View>
            <TouchableOpacity
              style={style.plusButton}
              onPress={() => toggleLocationModal()}>
              <Image
                style={{
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                  marginTop: 5,
                }}
                source={require('../../../assets/plus.png')}
              />
            </TouchableOpacity>
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
                  <Text style={{fontSize: 15, fontWeight: 'bold', flex: 0.8}}>
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
                  <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <Image
                      style={style.buttonIcon}
                      source={require('../../../assets/del.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <Text>colorId - {item.colorId}</Text> */}
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
                {/* <Text style={{color: '#000', fontWeight: 'bold'}}>
                  {item.styleName}
                </Text> */}
                <Text>ColorName - {item.colorName}</Text>
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
                        value={
                          quantity !== undefined ? quantity.toString() : ''
                        }
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
                          color: '#000',
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
            disabled={isSubmitting} // Disable button when submitting
            style={{
              borderWidth: 1,
              backgroundColor: '#390050',
              paddingVertical: 15,
              paddingHorizontal: 20,
              opacity: isSubmitting ? 0.5 : 1, // Dim button when submitting
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              {isSubmitting ? 'Placing Order...' : 'PLACE ORDER'}
            </Text>
          </TouchableOpacity>

          <ModalComponent
            modalVisible={modalVisible}
            closeModal={closeModal}
            selectedItem={selectedItem}
            inputValuess={inputValuess}
            onInputValueChange={handleInputValueChange} // Pass the function to handle input value changes
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
                  style={[style.input, {color: '#000'}]}
                  placeholder="Retailer name"
                  placeholderTextColor="#000"
                  onChangeText={text =>
                    setInputValues({...inputValues, firstName: text})
                  }
                />

                <TextInput
                  style={[style.input, {color: '#000'}]}
                  placeholder="phone number"
                  placeholderTextColor="#000"
                  onChangeText={text =>
                    setInputValues({...inputValues, phoneNumber: text})
                  }
                />
                <TextInput
                  style={[style.input, {color: '#000'}]}
                  placeholder="whatsapp number"
                  placeholderTextColor="#000"
                  onChangeText={text =>
                    setInputValues({...inputValues, whatsappId: text})
                  }
                />
                <TextInput
                  style={[style.input, {color: '#000'}]}
                  placeholder="city or town"
                  placeholderTextColor="#000"
                  onChangeText={text =>
                    setInputValues({...inputValues, cityOrTown: text})
                  }
                />
                <TextInput
                  style={[style.input, {color: '#000'}]}
                  placeholderTextColor="#000"
                  placeholder="state"
                  onChangeText={text =>
                    setInputValues({...inputValues, state: text})
                  }
                />
                <TextInput
                  style={[style.input, {color: '#000'}]}
                  placeholderTextColor="#000"
                  placeholder="country"
                  onChangeText={text =>
                    setInputValues({...inputValues, country: text})
                  }
                />
                <TouchableOpacity
                  style={style.saveButton}
                  onPress={handleSaveButtonPress}>
                  <Text style={style.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={isLocationModalVisible}
              onRequestClose={() => {
                toggleLocationModal();
              }}>
              <View style={style.modalContainer}>
                <View style={style.modalContent}>
                  <Text style={style.modalTitle}>Location Details</Text>
                  <TextInput
                    style={[style.input, {color: '#000'}]}
                    placeholder="Location Name"
                    placeholderTextColor="#000"
                    onChangeText={text =>
                      setLocationInputValues({
                        ...locationInputValues,
                        locationName: text,
                      })
                    }
                  />
                  <TextInput
                    style={[style.input, {color: '#000'}]}
                    placeholder="phone number"
                    placeholderTextColor="#000"
                    onChangeText={text =>
                      setLocationInputValues({
                        ...locationInputValues,
                        phoneNumber: text,
                      })
                    }
                  />
                  <TextInput
                    style={[style.input, {color: '#000'}]}
                    placeholder="Locality"
                    placeholderTextColor="#000"
                    onChangeText={text =>
                      setLocationInputValues({
                        ...locationInputValues,
                        locality: text,
                      })
                    }
                  />
                  <TextInput
                    style={[style.input, {color: '#000'}]}
                    placeholder="city or town"
                    placeholderTextColor="#000"
                    onChangeText={text =>
                      setLocationInputValues({
                        ...locationInputValues,
                        cityOrTown: text,
                      })
                    }
                  />
                  <TextInput
                    style={[style.input, {color: '#000'}]}
                    placeholderTextColor="#000"
                    placeholder="state"
                    onChangeText={text =>
                      setLocationInputValues({
                        ...locationInputValues,
                        state: text,
                      })
                    }
                  />
                  <TextInput
                    style={[style.input, {color: '#000'}]}
                    placeholderTextColor="#000"
                    placeholder="Pincode"
                    onChangeText={text =>
                      setLocationInputValues({
                        ...locationInputValues,
                        pincode: text,
                      })
                    }
                  />
                  <TextInput
                    style={[style.input, {color: '#000'}]}
                    placeholderTextColor="#000"
                    placeholder="country"
                    onChangeText={text =>
                      setLocationInputValues({
                        ...locationInputValues,
                        country: text,
                      })
                    }
                  />
                  <TouchableOpacity
                    onPress={handleSaveLocationButtonPress}
                    style={style.saveButton}>
                    <Text style={style.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginHorizontal: 5,
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
    alignItems: 'center',
    marginTop: 50,
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
    backgroundColor: '#390050',
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
