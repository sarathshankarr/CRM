import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { getAllCategories } from '../../utils/serviceApi/serviceAPIComponent';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const HomeCategories = ({ navigation }) => {
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const startTime = Date.now();
      const [tokenString] = await AsyncStorage.multiGet(['userdata']);
      const token = JSON.parse(tokenString[1]);
      const { data, error } = await getAllCategories(token.access_token);
      const endTime = Date.now();
      console.log('AsyncStorage time:', endTime - startTime, 'ms');
      
      if (data) {
        setSelectedDetails(data);
      } else {
        console.error('Error fetching categories:', error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCategoryPress = (details) => {
    setSelectedDetails(details);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    setSearchQuery(''); // Clear search query when closing search input
  };

  const onChangeText = (text) => {
    setSearchQuery(text);
  };

  const filteredData = selectedDetails.filter((item) =>
    item.categoryDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item }) => {
    const { categoryDesc, imageUrls } = item;

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          navigation.navigate('AllCategoriesListed', {
            item,
            categoryId: item.categoryId,
          });
        }}
      >
        <View style={styles.productImageContainer}>
          {imageUrls && imageUrls.length > 0 ? (
            <Image
              style={styles.productImage}
              source={{ uri: imageUrls[0] }}
              onError={(error) => console.error('Error loading image:', error)}
            />
          ) : (
            <Text>No Image</Text>
          )}
          <Text style={styles.productName}>{categoryDesc}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {showSearchInput ? (
          <TextInput
            style={styles.searchInput}
            autoFocus={true}
            onBlur={toggleSearchInput}
            onChangeText={onChangeText}
            placeholderTextColor="#000"
            placeholder="Search"
          />
        ) : (
          <Text style={styles.text}>
            {selectedDetails ? selectedDetails.length + ' Categories Listed' : ''}
          </Text>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={toggleSearchInput}>
          <Image style={styles.image} source={require('../../../assets/search.png')} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchQuery ? filteredData : selectedDetails}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
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
    paddingHorizontal: 20,
    marginTop: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    marginRight: 'auto',
    color: '#000',
  },
  searchButton: {
    marginLeft: 'auto',
  },
  image: {
    height: 30,
    width: 30,
  },
  productList: {
    paddingTop: 10,
  },
  productItem: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  productName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#fff"
    
  },
});

export default HomeCategories;
