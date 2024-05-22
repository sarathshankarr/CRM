import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeCategories from '../Pages/catogiries/HomeCategories';
import HomeAllProducts from '../Pages/catogiries/HomeAllProducts';
import {setLoggedInUser} from '../redux/actions/Actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SET_SELECTED_COMPANY} from '../redux/ActionTypes';
import CommonHeader from '../components/CommonHeader';
import CommenHeaderHomeScreen from '../components/CommenHeaderHomeScreen';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({state, descriptors, route}) => {
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const loggedInUser = useSelector(state => state.loggedInUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          console.log('Stored User Data:', userData); // Log stored user data
          dispatch(setLoggedInUser(userData));
          // Set the initially selected company to the first company in the compList
          if (userData && userData.compList && userData.compList.length > 0) {
            const initialCompany = userData.compList[0];
            setSelectedCompany(initialCompany); // Initialize selectedCompany with the first company
            dispatch({type: SET_SELECTED_COMPANY, payload: initialCompany}); // Store initial selected company in Redux store
            console.log('Initial Selected Company:', initialCompany); // Log initial selected company
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const onPress = routeName => {
    navigation.navigate(routeName);
  };

  const handleCompanySelect = company => {
    setSelectedCompany(company); // Update selected company
    console.log('Selected Company:', company); // Log the selected company
    setDropdownVisible(false);
    dispatch({type: SET_SELECTED_COMPANY, payload: company}); // Dispatch action to update selected company in Redux store
  };

  const companyName = selectedCompany ? selectedCompany.companyName : '';

  return (
    <View style={{backgroundColor: '#fff'}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            resizeMode="contain"
            source={require('../../assets/menu.png')}
            style={{height: 30, width: 30, marginHorizontal: 5}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDropdownVisible(!dropdownVisible)}
          style={{
            flex: 1,
            width: '50%',
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
            marginLeft: 8,
          }}>
          <Text style={{fontWeight: '600'}}>{companyName}</Text>
          <Image
            style={{height: 22, width: 22}}
            source={require('../../assets/edit.png')}
          />
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdownContainer}>
            <ScrollView>
              {loggedInUser && loggedInUser.compList
                ? loggedInUser.compList.map((company, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleCompanySelect(company)}
                      style={{
                        width: '100%',
                        height: 50,
                        justifyContent: 'center',
                        borderBottomWidth: 0.5,
                        borderColor: '#8e8e8e',
                      }}>
                      <Text
                        style={{
                          fontWeight: '600',
                          marginHorizontal: 15,
                        }}>
                        {company.companyName}
                      </Text>
                    </TouchableOpacity>
                  ))
                : null}
            </ScrollView>
          </View>
        )}
        <CommenHeaderHomeScreen
          navigation={navigation}
          // title={route.name}
          // showDrawerButton={showDrawerButton}
          showMessageIcon={true}
          showCartIcon={true}
          showLocationIcon={true}
        />
      </View>

      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const label = route.name;
          const isFocused = route.key === state.routes[state.index].key;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPress(route.name)}
              style={[styles.tabButton, isFocused && styles.activeTabButton]}>
              <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 30,
    borderColor: '#000',
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#390050',
    borderBottomColor: '#000',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  tabText: {
    fontSize: 16,
    color: '#000000',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  dropdownContainer: {
    marginLeft: 10,
    position: 'absolute',
    top: 45,
    left: 30,
    right: 0,
    backgroundColor: '#fff',
    elevation: 5,
    maxHeight: 150,
    width: '50%',
    borderRadius: 10,
    zIndex: 1,
  },
});

function Home() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="CATEGORIES" component={HomeCategories} />
      <Tab.Screen name="ALL PRODUCTS" component={HomeAllProducts} />
    </Tab.Navigator>
  );
}

export default Home;
