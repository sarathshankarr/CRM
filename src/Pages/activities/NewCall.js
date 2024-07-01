import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'react-native-check-box';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API} from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewCall = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const callData = route.params?.call;
  const { call } = route.params; 
  const callId = route.params?.callId;
  const [isDatePickerVisibleUntil, setDatePickerVisibilityUntil] =useState(false);
  const [selectedDateUntil, setSelectedDateUntil] = useState('Call Start Time');
  const [shipFromToClicked, setShipFromToClicked] = useState(false);
  const [shipFromToClickedUser, setShipFromToClickedUser] = useState(false); // State for the User dropdown
  const [shipFromToClickedStatus, setShipFromToClickedStatus] = useState(false); // State for the Status dropdown
  const [selectedDropdownOption, setSelectedDropdownOption] = useState({
    label: '',
    value: '',
  });
  const [selectedUserOption, setSelectedUserOption] = useState('');
  const [selectedStatusOption, setSelectedStatusOption] = useState('');
  const [showDropdownRow, setShowDropdownRow] = useState(false); // State to manage visibility of the main dropdown row
  const [markHighPriority, setMarkHighPriority] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingg, setLoadingg] = useState(false);
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [selectedCustomerOption, setSelectedCustomerOption] = useState(null);
  const [shipFromToClickedCustomer, setShipFromToClickedCustomer] =
    useState(false);
  const [shipFromToClickedTime, setShipFromToClickedTime] = useState(false);
  const [selectedDropdownOptionTime, setSelectedDropdownOptionTime] =
    useState('');
  const [shipFromToClickedCallType, setShipFromToClickedCallType] =
    useState(false);
  const [selectedDropdownOptionCallType, setSelectedDropdownOptionCallType] =
    useState({
      label: '',
      value: '',
    });
  const [selectedUserId, setSelectedUserId] = useState(null); // State to hold selected user's userId
  const [selectedUserName, setSelectedUserName] = useState(''); // State to hold selected user's userName
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [relatedTo, setRelatedTo] = useState('');
  const [agenda, setAgenda] = useState('');
  const [customers, setCustomers] = useState([]);
  const [callDescription, setCallDescription] = useState(callData ? callData.description : '');
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [initialSelectedCompany, setInitialSelectedCompany] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for button disabled


  useEffect(() => {
    console.log("call",call)
    if (route.params && route.params.call) {
      const { call } = route.params;
      setRelatedTo(call.relatedTo || '');
      setAgenda(call.agenda || '');
      setSelectedUserOption(call.userName);
      setSelectedStatusOption(call.status);
      setSelectedCustomerOption(call.customer)
      setSelectedUserName(call.userName);
      setSelectedCustomerOption(call.customer);
      setSelectedDropdownOptionTime(call.startTime);
      setMarkHighPriority(call.markHighPriority);
      
      console.log('Selected User Option:', call.userName);
      console.log('Selected Status Option:', call.status);
      console.log('Selected Customer Option:', call.customer);
      console.log('Selected Date Until:', call.startTime);

    }
    
  }, [route.params]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardSpace(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardSpace(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleShipDropdownClickCallType = () => {
    setShipFromToClickedCallType(!shipFromToClickedCallType);
    setShipFromToClicked(false);
    setShipFromToClickedUser(false);
    setShipFromToClickedStatus(false); 
  };

  const handleSearchCustomer = text => {
    const filtered = customers.filter(customer =>
      customer.firstName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCustomer(filtered);
  };

  const handleShipDropdownClickCustomer = () => {
    if (!shipFromToClickedCustomer) {
      getCustomersDetails();
    }
    setShipFromToClickedCustomer(!shipFromToClickedCustomer);
  };

  const handleDropdownSelectCustomer = customer => {
    setSelectedCustomerOption(customer.firstName);
    setSelectedCustomerId(customer.customerId); // Set selected customer's ID
    setShipFromToClickedCustomer(false);
  };

  const selectedCompany = useSelector(state => state.selectedCompany);

  useEffect(() => {
    const fetchInitialSelectedCompany = async () => {
      try {
        const initialCompanyData = await AsyncStorage.getItem('initialSelectedCompany');
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

  const companyId = selectedCompany ? selectedCompany.id : initialSelectedCompany?.id;

  const getCustomersDetails = () => {
    const apiUrl = `${global?.userData?.productURL}${API.ADD_CUSTOMER_LIST}/${companyId}`;
    setLoadingg(true);
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        const customerList = response?.data?.response?.customerList || [];
        setCustomers(customerList);
        setFilteredCustomer(customerList);
        setLoadingg(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoadingg(false);
      });
  };

  useEffect(() => {
    if (shipFromToClickedUser) {
      getUsers();
    }
  }, [shipFromToClickedUser]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShipDropdownClick = () => {
    setShipFromToClicked(!shipFromToClicked);
    setShipFromToClickedUser(false); // Close User dropdown if open
    setShipFromToClickedStatus(false); // Close Status dropdown if open
  };

  const handleShipDropdownClickUser = () => {
    setShipFromToClickedUser(!shipFromToClickedUser);
    setShipFromToClicked(false); // Close main dropdown if open
    setShipFromToClickedStatus(false); // Close Status dropdown if open
  };

  const handleShipDropdownClickStatus = () => {
    setShipFromToClickedStatus(!shipFromToClickedStatus);
    setShipFromToClicked(false); // Close main dropdown if open
    setShipFromToClickedUser(false); // Close User dropdown if open
  };

  const handleCheckboxChange = () => {
    setShowDropdownRow(!showDropdownRow);
  };

  const getUsers = () => {
    setLoading(true);
    const apiUrl = `${global?.userData?.productURL}${API.ADD_USERS}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        if (
          response.data &&
          response.data.status &&
          response.data.status.success
        ) {
          setUsers(response.data.response.users);
          setFilteredUsers(response.data.response.users); // Initialize filtered users
          // console.log(
          //   'response.data.response.users',
          //   response.data.response.users,
          // );
        } else {
          console.error('Error fetching users:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle selection of user dropdown option
  // Function to handle selection of user dropdown option
  const handleDropdownSelectUser = user => {
    setSelectedUserOption(user.firstName);
    setSelectedUserId(user.userId); // Set selected user's userId
    setSelectedUserName(user.firstName); // Set selected user's userName
    setShipFromToClickedUser(false); // Close User dropdown after selection (optional)
  };

  // Function to handle selection of status dropdown option
  const handleDropdownSelectStatus = option => {
    setSelectedStatusOption(option);
    setShipFromToClickedStatus(false); // Close Status dropdown after selection (optional)
  };

  const handleShipDropdownClickTime = () => {
    setShipFromToClickedTime(!shipFromToClickedTime);
    setShipFromToClicked(false);
    setShipFromToClickedUser(false);
    setShipFromToClickedStatus(false); // Close Status dropdown if open
  };

   const showDatePickerUntil = () => {
    setDatePickerVisibilityUntil(true);
  };

  const hideDatePickerUntil = () => {
    setDatePickerVisibilityUntil(false);
  };
  const handleDropdownSelectTime = option => {
    setSelectedDropdownOptionTime(option);
    setShipFromToClickedTime(false);
  };

  const handleDateConfirmUntil = date => {
    const formattedDate = date.toISOString().split('T')[0]; // Formats date to "YYYY-MM-DD"
    setSelectedDateUntil(formattedDate); // Set the state without additional text
    hideDatePickerUntil();
  };
  const handleSearch = text => {
    if (text.trim().length > 0) {
      const filtered = users.filter(user =>
        user.firstName.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const dropdownOptionsTime = [
    '12:00 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM',
    '12:00 AM',
    '12:30 AM',
    '01:00 AM',
    '01:30 AM',
    '02:00 AM',
    '02:30 AM',
    '03:00 AM',
    '03:30 AM',
    '04:00 AM',
    '04:30 AM',
    '05:00 AM',
    '05:30 AM',
    '06:00 AM',
    '06:30 AM',
    '07:00 AM',
    '07:30 AM',
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
  ];
  const CallType = [
    {label: 'Outbond', value: '1'},
    {label: 'Inbound', value: '2'},
  ];
  const handleDropdownSelectCallType = option => {
    setSelectedDropdownOptionCallType(option);
    setShipFromToClickedCallType(false);
  };

  const dropdownOptions = [
    {label: '15 Mins', value: 15},
    {label: '30 Mins', value: 30},
    {label: '1 Hr', value: 1},
    {label: '2 Hr', value: 2},
    {label: '1 day', value: 1},
    {label: '2 day', value: 2},
  ];
  const handleDropdownSelect = option => {
    setSelectedDropdownOption(option);
    setShipFromToClicked(false); // Close dropdown after selection (optional)
  };
  const statusOptions = [
    'Open',
    'Pending',
    'Assigned',
    'In Progress',
    'Completed',
  ];
  // const handleSave = () => {
  //   console.log('SAVE button pressed');
  //   addCall();
  // };
  console.log('selectedCustomerId', selectedCustomerId);
  console.log('selectedCustomerOption', selectedCustomerOption);
  console.log('selectedDropdownOptionCallType', selectedDropdownOptionCallType);
  console.log('selectedUserId', selectedUserId);
  console.log('selectedDropdownOption', selectedDropdownOption);
  console.log('relatedTo', relatedTo);
  console.log('agenda', agenda);
  console.log('selectedDateUntil', selectedDateUntil);


const handleSave = () => {
  if (isButtonDisabled) return;
  setIsButtonDisabled(true);

    const requestData = {
      id: callData ? callData.id : 0,
      customerId: selectedCustomerId || null,
      startDate: selectedDateUntil !== 'Call Start Time' ? selectedDateUntil : callData?.startDate,
      startTime: selectedDropdownOptionTime || callData?.startTime,
      remTime: selectedDropdownOption.value || callData?.remTime,
      callType: selectedDropdownOptionCallType.value || callData?.callType,
      relatedTo: relatedTo || callData?.relatedTo,
      agenda: agenda || callData?.agenda,
      t_company_id: callData?.t_company_id || '',
      customer: selectedCustomerOption || callData?.customer,
      duration: callData?.duration || '',
      assignTo: selectedUserId || callData?.assignTo,
      status: selectedStatusOption || callData?.status,
      userName: selectedUserName || callData?.userName,
      created_on: callData?.created_on || '',
    };

    axios
    .post(
      global?.userData?.productURL + API.ADD_NEW_CALL,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      },
    )
      .then(response => {
        console.log('Call added successfully:', response.data);
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error adding Call:', error);
      })
      .finally(() => {
        setIsButtonDisabled(false); // Re-enable button after the process completes
      });
  };

  return (
    <View style={{flex:1,backgroundColor:"#fff"}}
     >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            style={{height: 25, width: 25}}
            source={require('../../../assets/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Call</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleSave}  disabled={isButtonDisabled}>
          <Text style={styles.addButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Basic Info</Text>
      </View>
      <TouchableOpacity
        onPress={handleShipDropdownClickCustomer}
        style={styles.dropdownButton}>
        <Text>{selectedCustomerOption || 'Customers'}</Text>
        <Image
          source={require('../../../assets/dropdown.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>

      {loadingg ? (
        <ActivityIndicator size="large" color="#000" style={{marginTop: 20}} />
      ) : (
        shipFromToClickedCustomer.length === 0 ? (
          <Text style={styles.noCategoriesText}>Sorry, no results found! </Text>
        ):
        shipFromToClickedCustomer && (
          <View style={styles.dropdownContent1}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              onChangeText={handleSearchCustomer}
            />
            <ScrollView style={styles.scrollView}>
              {filteredCustomer.map((customer, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDropdownSelectCustomer(customer)}
                  style={styles.dropdownOption}>
                  <Text>{customer.firstName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <TouchableOpacity
          onPress={showDatePickerUntil}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 10,
            borderWidth: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
            marginHorizontal: 10,
          }}>
          <Text>{selectedDateUntil}</Text>
          <Image
            style={styles.dateIcon}
            source={require('../../../assets/date.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShipDropdownClickTime}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 10,
            borderWidth: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
            marginHorizontal: 10,
          }}>
          <Text>{selectedDropdownOptionTime || ''}</Text>
          <Image
            source={require('../../../assets/dropdown.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>

      {shipFromToClickedTime && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.dropdownContent1}>
            {dropdownOptionsTime.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => handleDropdownSelectTime(option)}>
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        <CheckBox isChecked={showDropdownRow} onClick={handleCheckboxChange} />
        <Text style={{marginLeft: 5}}>Reminder</Text>
      </View>

      {showDropdownRow && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            marginVertical: 10,
          }}>
          <TouchableOpacity
            onPress={handleShipDropdownClick}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 10,
              borderWidth: 0.5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
            }}>
            <Text>{selectedDropdownOption.label || 'before start time'}</Text>
            <Image
              source={require('../../../assets/dropdown.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>
      )}

      {shipFromToClicked && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.dropdownContent1}>
            {dropdownOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => handleDropdownSelect(option)}>
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={handleShipDropdownClickCallType}
        style={{
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
          marginHorizontal: 10,
        }}>
        <Text>{selectedDropdownOptionCallType.label || 'Call Type'}</Text>
        <Image
          source={require('../../../assets/dropdown.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
      {shipFromToClickedCallType && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.dropdownContent1}>
            {CallType.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => handleDropdownSelectCallType(option)}>
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Related To *"
          placeholderTextColor="#000"
          value={relatedTo}
          onChangeText={setRelatedTo}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Call Agenda"
          placeholderTextColor="#000"
          value={agenda}
          onChangeText={setAgenda}
        />
      </View>
      <TouchableOpacity
        onPress={handleShipDropdownClickUser}
        style={{
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
          marginHorizontal: 10,
        }}>
        <Text>{selectedUserOption || 'Users'}</Text>
        <Image
          source={require('../../../assets/dropdown.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{marginTop: 20}} />
      ) : (
        shipFromToClickedUser && (
          <View style={styles.dropdownContent1}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              onChangeText={handleSearch}
            />
            <ScrollView style={styles.dropdownScroll}>
              {filteredUsers.map((user, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => handleDropdownSelectUser(user)}>
                  <Text>{user.firstName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )
      )}
      {/* Status Dropdown */}
      <TouchableOpacity
        onPress={handleShipDropdownClickStatus}
        style={{
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
          marginHorizontal: 10,
          marginVertical: 10,
        }}>
        <Text>{selectedStatusOption || 'Status'}</Text>
        <Image
          source={require('../../../assets/dropdown.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>

      {shipFromToClickedStatus && (
        <View style={styles.dropdownContent1}>
          <ScrollView style={styles.scrollView}>
            {statusOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => handleDropdownSelectStatus(option)}>
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisibleUntil}
        mode="date"
        onConfirm={handleDateConfirmUntil}
        onCancel={hideDatePickerUntil}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#390050',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  datecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  dateIcon: {
    width: 25,
    height: 25,
  },
  dropdownContent: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },

  searchInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scrollView: {
    maxHeight: 150,
  },
  dropdownOption: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginHorizontal: 10,
  },
  dropdownContent1: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
});

export default NewCall;
