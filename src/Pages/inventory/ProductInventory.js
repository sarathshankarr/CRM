import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {API} from '../../config/apiConfig';
import axios from 'axios';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductInventory = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialSelectedCompany, setInitialSelectedCompany] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const selectedCompany = useSelector(state => state.selectedCompany);
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
    getProductInventory();
  }, []);

  const getProductInventory = async () => {
    const apiUrl = `${global?.userData?.productURL}${API.ADD_PRODUCT_INVENTORY}`;
    try {
      setLoading(true);
      const response = await axios.post(
        apiUrl,
        {
          companyId: companyId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${global?.userData?.token?.access_token}`,
          },
        },
      );
      // console.log('Response:', response.data);
      setInventoryData(response.data.gsCodesList);
      setFilteredData(response.data.gsCodesList); // Initialize filtered data
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeText = text => {
    setSearchQuery(text);
    if (text) {
      const newData = inventoryData.filter(item => {
        const itemData = `${item.styleName.toUpperCase()} ${item.sizeCode.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(inventoryData);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getProductInventory();
    setRefreshing(false);
  };

  const renderItem = ({item}) => (
    <View>
      <View style={styles.inventoryItem}>
        <Text style={{flex: 2}}>{item.styleName}</Text>
        <Text style={styles.itemText}>{item.sizeCode}</Text>
        <Text style={styles.itemText}>{item.availQty}</Text>
      </View>
      <View
        style={{borderBottomWidth: 1, borderBottomColor: 'lightgray'}}></View>
    </View>
  );

  const handleGoBack = () => {
    Keyboard.dismiss(); // Dismiss keyboard when navigating back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            style={styles.backIcon}
            source={require('../../../assets/back_arrow.png')}
          />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={[styles.searchInput, {color: '#000'}]}
            onChangeText={onChangeText}
            placeholder="Product Inventory"
            placeholderTextColor="#000"
          />
          <TouchableOpacity style={styles.searchIconContainer}>
            <Image
              style={styles.searchIcon}
              source={require('../../../assets/search.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={{flex: 2}}>Style Name</Text>
        <Text style={styles.headerText}>Size</Text>
        <Text style={styles.headerText}>Avail Qty</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          size="large"
          color="#390050"
        />
      ) : (searchQuery && filteredData.length === 0) ||
        (!searchQuery && inventoryData.length === 0) ? (
        <Text style={styles.noCategoriesText}>Sorry, no results found!</Text>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 15,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchIconContainer: {
    padding: 10,
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  itemText: {
    flex: 1,
    textAlign: 'center',
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

export default ProductInventory;
