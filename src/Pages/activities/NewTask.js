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
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from 'react-native-check-box';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const NewTask = () => {
    const dispatch = useDispatch(); // Get dispatch function from useDispatch hook
    const userData = useSelector(state => state.loggedInUser); 
  console.log(userData)
    const navigation = useNavigation();
    const route = useRoute();
    const { task } = route.params; 
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

  useEffect(() => {
    console.log("task",task)
    if (route.params && route.params.task) {
      const { task } = route.params;
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
    const apiUrl = 'https://crm.codeverse.co/erpportal/api/users';
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
        console.log("response.data.response.users",)
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
    setShipFromToClickedUser(false); // Close User dropdown after selection (optional)
  };
  const handleShipDropdownClick = () => {
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
  const handleSave = () => {
    addNewTask();
  };
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

  const addNewTask = () => {
    const requestData = {
      id: task.id,
      created_on: null,
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
    };

    axios
      .post(
        'https://crm.codeverse.co/erpportal/api/master/addTask',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${global.userData.token.access_token}`,
          },
        },
      )
      .then(response => {
        console.log('Task added successfully:', response.data);
        // Optionally, you can handle success response here
      })
      .catch(error => {
        console.error('Error adding Task:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            style={{height: 25, width: 25}}
            source={require('../../../assets/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Task</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleSave}>
          <Text style={styles.addButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Basic Info</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Name *"
          placeholderTextColor="#000"
          value={taskName}
          onChangeText={setTaskName}
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
        <View style={styles.dropdown}>
          {dropdownOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleDropdownSelect(option)}
              style={styles.dropdownOption}>
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Related To"
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
  container: {
    flex: 1,
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
    marginTop: 10,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default NewTask;