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
  BackHandler,
  Alert,
} from 'react-native';
import { getAllCategories } from '../../utils/serviceApi/serviceAPIComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux'; // Importing useDispatch
import {  storeCategoryIds } from '../../redux/actions/Actions';

const HomeCategories = ({navigation}) => {
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialSelectedCompany, setInitialSelectedCompany] = useState(null);

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
    fetchCategories();
  }, [companyId]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset search when component is focused
      setSearchQuery('');
      setShowSearchInput(false); // Hide search input when component is focused
    });
    return unsubscribe;
  }, [navigation]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [tokenString] = await AsyncStorage.multiGet(['userdata']);
      const token = JSON.parse(tokenString[1]);
      const { data, error } = await getAllCategories(token.access_token, companyId);
  
      if (data) {
        // Filter categories based on the companyId
        const filteredCategories = data.filter(category => category.companyId === companyId);
        setSelectedDetails(filteredCategories);
      } else {
        console.error('Error fetching categories:', error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchQuery('');
    }
  };

  const onChangeText = text => {
    setSearchQuery(text);
  };

  const renderProductItem = ({item}) => {
    const {categoryDesc, imageUrls} = item;

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          navigation.navigate('AllCategoriesListed', {
            item,
            categoryId: item.categoryId,
            categoryDesc: item.categoryDesc, // Pass the category description
          });
        }}>
        <View style={styles.productImageContainer}>
          {imageUrls && imageUrls.length > 0 ? (
            <Image style={styles.productImage} source={{uri: imageUrls[0]}} />
          ) : (
            <Image
              style={styles.productImage}
              resizeMode="contain"
              source={require('../../../assets/Noimg.jpg')}
            />
          )}
          <View
            style={{
              borderColor: '#000',
              backgroundColor: '#fff',
            }}>
            <Text
              style={[
                styles.productName,
                item.imageUrls &&
                  item.imageUrls.length > 0 && {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  },
              ]}>
              {categoryDesc}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {showSearchInput ? (
          <TextInput
            style={[
              styles.searchInput,
              searchQuery.length > 0 && styles.searchInputActive,
            ]}
            autoFocus={true}
            value={searchQuery} // Set value to the search query
            onChangeText={onChangeText}
            placeholder="Search"
            placeholderTextColor="#000"
          />
        ) : (
          <Text style={styles.text}>
            {searchQuery
              ? searchQuery
              : selectedDetails
              ? selectedDetails.length + ' Categories Listed'
              : ''}
          </Text>
        )}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={toggleSearchInput}>
          <Image
            style={styles.image}
            source={
              showSearchInput
                ? require('../../../assets/close.png')
                : require('../../../assets/search.png')
            }
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          size="large"
          color="#390050"
        />
      ) : (
        <FlatList
          data={selectedDetails.filter(item =>
            item.categoryDesc.toLowerCase().includes(searchQuery.toLowerCase()),
          )}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
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
  searchInputActive: {
    color: '#000',
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
    height: 200,
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
    padding: 5,
  },
});

export default HomeCategories;