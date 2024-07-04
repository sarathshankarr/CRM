import React, {useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Alert,
  Switch,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'react-native-check-box';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {API} from '../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewTask = () => {
  const dispatch = useDispatch(); // Get dispatch function from useDispatch hook
  const userData = useSelector(state => state.loggedInUser);
  const navigation = useNavigation();
  const route = useRoute();
  const {task} = route.params;
  const callData = route.params?.call;
  const [isDatePickerVisibleDue, setDatePickerVisibilityDue] = useState(false);
  const [selectedDateDue, setSelectedDateDue] = useState('Due Date');
  const [isDatePickerVisibleUntil, setDatePickerVisibilityUntil] =
    useState(false);
  const [selectedDateUntil, setSelectedDateUntil] = useState('Until Date');

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

  const [taskName, setTaskName] = useState('');
  const [relatedTo, setRelatedTo] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // State to hold selected user's userId
  const [selectedUserName, setSelectedUserName] = useState(''); // State to hold selected user's userName
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for button disabled
  const [loadingg, setLoadingg] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [shipFromToClickedCustomer, setShipFromToClickedCustomer] =
    useState(false);
  const [initialSelectedCompany, setInitialSelectedCompany] = useState(null);
  const [selectedCustomerOption, setSelectedCustomerOption] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [loadinggg, setLoadinggg] = useState(false);
  const [distributor, setDistributor] = useState([]);
  const [filteredDistributor, setFilterdDistributor] = useState([]);
  const [shipFromToClickedDistributor, setShipFromToClickedDistributor] =
    useState(false);
  const [selectedDistributorOption, setSelectedDistributorOption] =
    useState(null);
  const [selectedDistributorId, setSelectedDistributorId] = useState(null);
  const selectedCompany = useSelector(state => state.selectedCompany);
  const [customerLocations, setCustomerLocations] = useState([]);
  const [fromToClicked, setFromToClicked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationId, setSelectedLocationiD] = useState('');

  const getCustomerLocations = () => {
    let customerType;

    // Toggle logic based on switch status
    const switchStatus = isEnabled; // Assuming isEnabled controls the switch

    if (switchStatus) {
      customerType = 1; // Retailer
    } else {
      customerType = 3; // Distributor
    }

    console.log(`Customer Type: ${customerType}`);

    const customerId = switchStatus
      ? selectedCustomerId
      : selectedDistributorId;
    console.log('customerId:', customerId);

    const apiUrl = `${global?.userData?.productURL}${API.GET_CUSTOMER_LOCATION}/${customerId}/${customerType}/${companyId}`;
    console.log('Fetching customer locations with companyId:', companyId);

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        setCustomerLocations(response.data);
        console.log('location response', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        if (error.response && error.response.status === 401) {
          // Handle unauthorized error
        }
      });
  };

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

  const getDistributorsDetails = () => {
    const apiUrl = `${global?.userData?.productURL}${API.GET_DISTRIBUTORS_DETAILS}/${companyId}`;
    setLoadinggg(true);
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        const distributorList = response?.data?.response?.distributorList || [];
        setDistributor(distributorList);
        setFilterdDistributor(distributorList);
        setLoadinggg(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoadinggg(false);
      });
  };

  const handleFromDropdownClick = () => {
    setFromToClicked(!fromToClicked);
    if (!fromToClicked) {
      getCustomerLocations(selectedCustomerId);
    }
  };
  const handleLocationSelection = location => {
    setSelectedLocation(location.locationName);
    setSelectedLocationiD(location.locationId);
    setFromToClicked(false);
  };

  const handleShipDropdownClick = () => {
    setShipFromToClicked(!shipFromToClicked);
    if (!shipFromToClicked) {
      getCustomerLocations(selectedCustomerId);
    }
  };
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

  const handleShipDropdownClickDistributor = () => {
    if (!shipFromToClickedDistributor) {
      getDistributorsDetails();
    }
    setShipFromToClickedDistributor(!shipFromToClickedDistributor);
  };
  const handleSearchDistributor = text => {
    const filtered = distributor.filter(distributor =>
      distributor.firstName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilterdDistributor(filtered);
  };
  const handleDropdownSelectDistributor = Distributor => {
    setSelectedDistributorOption(Distributor.firstName);
    setSelectedDistributorId(Distributor.id); // Set selected customer's ID
    setShipFromToClickedDistributor(false);
  };

  useEffect(() => {
    console.log('task', task);
    if (route.params && route.params.task) {
      const {task} = route.params;
      // Populate state with task details if available
      setTaskName(task.taskName || '');
      setRelatedTo(task.relatedTo || '');
      setDesc(task.desc || '');
      setSelectedUserId(task.assign_to || null);
      setSelectedUserName(task.userName || '');
      setSelectedStatusOption(task.status || '');
      setSelectedDropdownOption({
        value: task.repeatRem || '',
      });
    }
  }, [route.params]);

  useEffect(() => {
    if (shipFromToClickedUser) {
      getUsers();
    }
  }, [shipFromToClickedUser]);

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShipDropdownClickUser = () => {
    setShipFromToClickedUser(!shipFromToClickedUser);
    setShipFromToClicked(false); // Close main dropdown if open
    setShipFromToClickedStatus(false); // Close Status dropdown if open
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
          console.log(
            'response.data.response.users',
            response.data.response.users,
          );
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

  const handleDropdownSelectUser = user => {
    setSelectedUserOption(user.firstName);
    setSelectedUserId(user.userId); // Set selected user's userId
    setSelectedUserName(user.firstName); // Set selected user's userName
    console.log('Selected UserName:', user.firstName); // Add this line for debugging
    setShipFromToClickedUser(false); // Close User dropdown after selection (optional)
  };

  const handleShipDropdownClickk = () => {
    setShipFromToClicked(!shipFromToClicked);
    setShipFromToClickedUser(false); // Close User dropdown if open
    setShipFromToClickedStatus(false); // Close Status dropdown if open
  };
  const handleDropdownSelectStatus = option => {
    setSelectedStatusOption(option);
    setShipFromToClickedStatus(false); // Close Status dropdown after selection (optional)
  };
  const showDatePickerUntil = () => {
    setDatePickerVisibilityUntil(true);
  };

  const handleCheckPriority = () => {
    setMarkHighPriority(!markHighPriority); // Toggle checkbox state
  };

  const showDatePickerDue = () => {
    setDatePickerVisibilityDue(true);
  };

  const hideDatePickerDue = () => {
    setDatePickerVisibilityDue(false);
  };

  const hideDatePickerUntil = () => {
    setDatePickerVisibilityUntil(false);
  };

  const handleShipDropdownClickStatus = () => {
    setShipFromToClickedStatus(!shipFromToClickedStatus);
    setShipFromToClicked(false); // Close main dropdown if open
    setShipFromToClickedUser(false); // Close User dropdown if open
  };
  // const handleSave = () => {
  //   addNewTask();
  // };
  const handleDateConfirmDue = date => {
    const formattedDate = date.toISOString().split('T')[0]; // Formats date to "YYYY-MM-DD"
    setSelectedDateDue(formattedDate); // Set the state without additional text
    hideDatePickerDue();
  };

  const handleDateConfirmUntil = date => {
    const formattedDate = date.toISOString().split('T')[0]; // Formats date to "YYYY-MM-DD"
    setSelectedDateUntil(formattedDate); // Set the state without additional text
    hideDatePickerUntil();
  };
  console.log(selectedLocationId);

  const handleSave = () => {
    console.log(customerType);
    if (!taskName.trim() || !relatedTo.trim()) {
      Alert.alert('Alert', 'Please fill in all mandatory fields');
      return; // Exit the function early if any mandatory field is empty
    }

    if (isButtonDisabled) return;
    setIsButtonDisabled(true);
    const switchStatus = isEnabled; // Assuming isEnabled controls the switch
    const customerType = switchStatus ? 1 : 3; // 1 for Retailer, 3 for Distributor

    const requestData = {
      id: route.params.task.id || 0,
      customerId: selectedCustomerId || null,
      customer: selectedCustomerOption || task?.customer,
      created_on: route.params.task.created_on,
      taskName: taskName || null,
      dueDate: selectedDateDue !== 'Due Date' ? selectedDateDue : null,
      repeatRem: selectedDropdownOption.value,
      untilDate: selectedDateUntil !== 'Until Date' ? selectedDateUntil : null,
      relatedTo: relatedTo || null,
      desc: desc || null,
      completed: null,
      priority: null,
      assign_to: selectedUserId,
      assign_by: userData.userid,
      t_company_id: null,
      unique_id: null,
      status: selectedStatusOption,
      userName: selectedUserName,
      locId: selectedLocationId,
      customerType: customerType,
    };

    console.log('Request Data:', requestData);

    axios
      .post(global?.userData?.productURL + API.ADD_UPDATE_TASK, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        console.log('Task added successfully:', response.data);
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error adding task:', error);
      })
      .finally(() => {
        setIsButtonDisabled(false); // Re-enable button after the process completes
      });
  };

  const dropdownOptions = [
    {label: 'Every Day', value: '1'},
    {label: 'Every Week', value: '2'},
    {label: 'Every Month', value: '3'},
    {label: 'Every Year', value: '4'},
  ];
  const handleDropdownSelect = option => {
    setSelectedDropdownOption(option); // Assuming `option` is an object { label: '...', value: '...' }
    setShipFromToClicked(false); // Close dropdown after selection (optional)
  };

  const statusOptions = [
    'Open',
    'Pending',
    'Assigned',
    'In Progress',
    'Completed',
  ];

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
  const renderCustomerDetails = () => (
    <View style={{marginBottom:10}}>
      <TouchableOpacity
        onPress={handleShipDropdownClickCustomer}
        style={styles.dropdownButton}>
        <Text>{selectedCustomerOption || 'Retailer *'}</Text>
        <Image
          source={require('../../../assets/dropdown.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>

      {loadingg ? (
        <ActivityIndicator size="large" color="#000" style={{marginTop: 20}} />
      ) : shipFromToClickedCustomer.length === 0 ? (
        <Text style={styles.noCategoriesText}>Sorry, no results found!</Text>
      ) : (
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
    </View>
  );

  const renderDistributorDetails = () => (
    <View style={{marginBottom:10}}>
      <TouchableOpacity
        onPress={handleShipDropdownClickDistributor}
        style={styles.dropdownButton}>
        <Text>{selectedDistributorOption || 'Distributor *'}</Text>
        <Image
          source={require('../../../assets/dropdown.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>

      {loadinggg ? (
        <ActivityIndicator size="large" color="#000" style={{marginTop: 20}} />
      ) : shipFromToClickedDistributor.length === 0 ? (
        <Text style={styles.noCategoriesText}>Sorry, no results found!</Text>
      ) : (
        shipFromToClickedDistributor && (
          <View style={styles.dropdownContent1}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              onChangeText={handleSearchDistributor}
            />
            <ScrollView style={styles.scrollView}>
              {filteredDistributor.map((distributor, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDropdownSelectDistributor(distributor)}
                  style={styles.dropdownOption}>
                  <Text>{distributor.firstName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )
      )}
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            style={{height: 25, width: 25}}
            source={require('../../../assets/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Task</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSave}
          disabled={isButtonDisabled}>
          <Text style={styles.addButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Basic Info</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          Slide For Retailer
        </Text>
      </View>
      {isEnabled ? renderCustomerDetails() : renderDistributorDetails()}
      <TouchableOpacity
        onPress={handleFromDropdownClick}
        style={styles.dropdownButton}>
        <Text style={{}}>
          {selectedLocation.length > 0 ? `${selectedLocation}` : 'Location *'}
        </Text>
        <Image
          source={require('../../../assets/dropdown.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
      {fromToClicked && (
        <View style={styles.dropdownContent1}>
          <ScrollView style={styles.scrollView}>
            {customerLocations.map(location => (
              <TouchableOpacity
                style={styles.dropdownOption}
                key={location.locationId}
                onPress={() => handleLocationSelection(location)}>
                <Text>{location.locationName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
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
          marginTop:10
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
            <ScrollView style={styles.scrollView}>
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Name *"
          placeholderTextColor="#000"
          value={taskName}
          onChangeText={setTaskName}
        />
      </View>
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
          placeholder="Description"
          placeholderTextColor="#000"
          value={desc}
          onChangeText={setDesc}
        />
      </View>

      <View style={styles.datecontainer}>
        <TouchableOpacity onPress={showDatePickerDue}>
          <View style={{paddingVertical: 10}}>
            <Text style={{marginLeft: 10}}>{selectedDateDue}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
          }}
          onPress={showDatePickerDue}>
          <Image
            style={styles.dateIcon}
            source={require('../../../assets/date.png')}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        <CheckBox isChecked={showDropdownRow} onClick={handleCheckboxChange} />
        <Text style={{marginLeft: 5}}>Repeat</Text>
      </View>

      {showDropdownRow && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <TouchableOpacity
            onPress={handleShipDropdownClickk}
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
              marginRight: 5,
            }}>
            <Text>{selectedDropdownOption.label || ''}</Text>
            <Image
              source={require('../../../assets/dropdown.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>

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
              marginLeft: 5,
            }}>
            <Text>{selectedDateUntil}</Text>
            <Image
              style={styles.dateIcon}
              source={require('../../../assets/date.png')}
            />
          </TouchableOpacity>
        </View>
      )}

      {shipFromToClicked && (
        <View style={[styles.dropdownContent, { bottom: 190 }]}>
          <ScrollView style={styles.scrollView}>
          {dropdownOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleDropdownSelect(option)}
              style={styles.dropdownOption}>
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
      )}

     

      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          flexDirection: 'row',
        }}>
        <CheckBox isChecked={markHighPriority} onClick={handleCheckPriority} />
        <Text>Mark as High Priority</Text>
      </View>

  
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
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {shipFromToClickedStatus && (
        <View style={[styles.dropdownContent, { bottom: 80 }]}>
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
        isVisible={isDatePickerVisibleDue}
        mode="date"
        onConfirm={handleDateConfirmDue}
        onCancel={hideDatePickerDue}
      />
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
  modalContainer: {
    backgroundColor: '#fff',
    flex: 1,
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
    marginTop: 10,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    paddingLeft: 10, // Add padding if you want some space from the left edge
    marginHorizontal: 10,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#000',
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
    position: 'absolute',
    zIndex: 1,
    width: '80%',
    maxHeight: 150,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
  dropdownContent1: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
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
});

export default NewTask;
