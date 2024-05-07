import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {API} from '../config/apiConfig';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const getAllOrders = useCallback(() => {
    setLoading(true); // Set loading to true when fetching data
    const queryParams = new URLSearchParams({
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
      userId: '1',
      orderId: '',
    });

    axios
      .get(`${API.GET_ALL_ORDER}?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        // Handle success
        if (pageNo === 1) {
          setOrders(response.data.response.ordersList);
        } else {
          setOrders(prevOrders => [
            ...prevOrders,
            ...response.data.response.ordersList,
          ]);
        }
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when done fetching data
      });
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (firstLoad) {
      getAllOrders();
      setFirstLoad(false);
    }
  }, [firstLoad, getAllOrders]);

  useFocusEffect(
    useCallback(() => {
      if (!firstLoad) {
        getAllOrders();
      }
    }, [firstLoad, getAllOrders]),
  );

  const loadMoreOrders = () => {
    if (!loading) {
      setPageNo(pageNo + 1);
      setLoading(true);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={{marginBottom: 6, borderWidth: 1, marginHorizontal: 10}}>
      <View style={{marginHorizontal: 10, marginVertical: 5}}>
        {/* <Text>Order ID: {item.orderId}</Text> */}
        <Text>Order Date: {item.orderDate}</Text>
        <Text>Ship Date: {item.shipDate}</Text>
        <Text>Total Amount: {item.totalAmount}</Text>
        {/* <Text>Total Qty: {item.totalQty}</Text> */}
        <Text>Customer Name: {item.customerName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{backgroundColor: '#fff',flex:1}}>
      <Text style={{marginHorizontal: 10, marginVertical: 5}}>Orders</Text>
      {loading && orders.length === 0 ? ( // Show ActivityIndicator if loading and no orders are loaded yet
        <ActivityIndicator
          size="large"
          color="green"
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.orderId ? item.orderId.toString() : index.toString()
          }
          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          onRefresh={() => {
            setPageNo(1);
          }}
        />
      )}
    </View>
  );
};

export default Order;