import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { API } from '../../config/apiConfig';

const Call = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = calls.filter(call => {
      const customerName = call.customer ? call.customer.toLowerCase() : ''; // Check if customer name is not null
      return customerName.includes(text.toLowerCase());
    });
    setFilteredCalls(filtered);
  };

  const handleAdd = () => {
    navigation.navigate('NewCall');
  };

  const getAllCalls = () => {
    setLoading(true); // Show loading indicator
    const apiUrl = `${global?.userData?.productURL}${API.GET_ALL_CALL}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        setCalls(response.data); // Save API response data to state
        setFilteredCalls(response.data); // Initialize filtered calls with all calls
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Hide loading indicator
      });
  };

  useEffect(() => {
    getAllCalls();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.callItem}>
      <Text style={{ flex: 2 }}>{item.customer}</Text>
      <Text style={{ flex: 2 }}>{item.relatedTo}</Text>
      <Text style={{ flex: 1 }}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            autoFocus={true}
            placeholder="Search"
            placeholderTextColor="#000"
            value={searchQuery}
            onChangeText={handleSearch} // Update filteredCalls dynamically on text change
          />
          {/* Removed onPress={toggleSearchInput} from TouchableOpacity */}
          <TouchableOpacity style={styles.searchButton}>
            <Image
              style={styles.searchIcon}
              source={require('../../../assets/search.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add Call</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Customer</Text>
        <Text style={styles.headerText}>Related To</Text>
        <Text style={styles.headerText}>Status</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredCalls}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
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
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  addButton: {
    paddingHorizontal: 30,
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#390050',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  callItem: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  callText: {
    fontSize: 14,
  },
});

export default Call;
