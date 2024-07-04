import React, { useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API } from '../../config/apiConfig';

const Tasks = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks(); // Fetch tasks when the screen is focused
    }, [])
  );

  const fetchTasks = () => {
    setLoading(true); // Show loading indicator
    const apiUrl = `${global?.userData?.productURL}${API.GET_ALL_TASK}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        setTasks(response.data); // Update tasks state
        setFilteredTasks(response.data); // Initialize filtered tasks with all tasks
        console.log("fetchTasks",response.data)
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Hide loading indicator
      });
  };

  const fetchTaskById = (taskId) => {
    setLoading(true);
    const apiUrl = `${global?.userData?.productURL}${API.GET_TASK_BY_ID}/${taskId}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        navigation.navigate('NewTask', { task: response.data, taskId: taskId }); // Pass taskId along with task details
        console.log('Fetched task by ID:', response.data);
      })
      .catch(error => {
        console.error('Error fetching task by ID:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle search input change
  const handleSearchInputChange = (query) => {
    setSearchQuery(query); // Update search query state
    filterTasks(query); // Call filter function on search input change
  };

  // Filter tasks based on search query
  const filterTasks = (query) => {
    const filtered = tasks.filter(task => {
      const name = task.taskName ? task.taskName.toLowerCase() : ''; // Check if taskName is not null
      return name.includes(query.toLowerCase());
    });
    setFilteredTasks(filtered);
  };
  
  const handleAdd = () => {
    navigation.navigate('NewTask', { task: {} }); // Pass an empty object or any default value
  };

  const truncateText = (text, maxWords) => {
    if (!text || typeof text !== 'string') {
      return ''; // or handle appropriately for your use case
    }

    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => fetchTaskById(item.id)} // Fetch and navigate to task details
    >
      <Text style={styles.taskText}>{item.taskName}</Text>
      <Text style={styles.taskText1}>{item.relatedTo}</Text>
      <Text style={styles.taskText3}>{item.status}</Text>
      <Text style={styles.taskText}>{truncateText(item.desc, 2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#000"
            value={searchQuery}
            onChangeText={handleSearchInputChange} // Update search query on input change
          />
          {/* Remove TouchableOpacity around Image for dynamic search */}
          <Image
            style={styles.searchIcon}
            source={require('../../../assets/search.png')}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.headerText}>Task Name</Text>
        <Text style={styles.headerText}>Related To</Text>
        <Text style={styles.headerText}>Status</Text>
        <Text style={styles.headerText}>Description</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredTasks.length === 0 ? (
        <Text style={styles.noCategoriesText}>Sorry, no results found! </Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginHorizontal: 5, // Add margin to properly separate icon from input
  },
  addButton: {
    paddingHorizontal: 30,
    padding: 10,
    backgroundColor: '#390050',
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  taskText1: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  taskText3: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  noCategoriesText:{
    top: 40,
    textAlign:"center",
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 5,
  }
});

export default Tasks;
