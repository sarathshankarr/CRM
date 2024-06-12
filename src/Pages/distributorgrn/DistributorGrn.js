import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'; // Import RefreshControl
import { API } from '../../config/apiConfig';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DistributorGrn = () => {
  const navigation = useNavigation();
  const [initialSelectedCompany, setInitialSelectedCompany] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [refreshing, setRefreshing] = useState(false); // State to manage refresh state

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

  useEffect(() => {
    if (companyId) {
      getDistributorGrn();
    }
  }, [companyId]);

  const getDistributorGrn = async () => {
    setLoading(true); // Set loading to true when fetching data
    const apiUrl = `${global?.userData?.productURL}${API.GET_DISTRIBUTOR_GRN}/${companyId}`;
    console.log("companyId",companyId)
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      });
      if (response.data.status.success) {
        setOrders(response.data.response.ordersList);
        // console.log('Orders:', response.data.response.ordersList);
      } else {
        console.error('Failed to fetch orders:', response.data.status);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is completed
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getDistributorGrn();
    setRefreshing(false);
  };

  const gotoDistributorOrder = (orderId) => {
    navigation.navigate("DistributorOrder", { orderId });
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity onPress={() => gotoDistributorOrder(item.orderId)} style={styles.orderItem}>
      <Text style={styles.orderIdText}>{item.orderId}</Text>
      <Text style={styles.customerText}>{item.customerName}</Text>
      <Text style={styles.qtyText}>{item.shipQty || 0}</Text>
      <Text style={styles.statusText}>{item.orderStatus}</Text>
      <Text style={styles.dateText}>{item.orderDate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderIdText}>Id</Text>
        <Text style={styles.customerText}>Customer</Text>
        <Text style={styles.qtyText}>Total Qty</Text>
        <Text style={styles.statusText}>Status</Text>
        <Text style={styles.dateText}>Order Date</Text>
      </View>
      {loading ? ( // Render ActivityIndicator when loading is true
        <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.orderId.toString()}
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
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderIdText: {
    flex: 0.8,
  },
  customerText: {
    flex: 1.5,
  },
  qtyText: {
    flex: 0.9,
    textAlign: 'center',
  },
  statusText: {
    flex: 1.4,
    marginLeft: 10,
  },
  dateText: {
    flex: 1.5,
    textAlign: 'center',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DistributorGrn;
