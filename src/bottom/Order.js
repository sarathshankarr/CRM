import React, { useEffect, useState, useCallback } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import { API } from "../config/apiConfig";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const getAllOrders = useCallback(() => {
    axios.post(API.GET_ALL_ORDER, {
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
      userId: "1",
      orderId: ""
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${global.userData.access_token}`
      }
    })
    .then(response => {
      // Handle success
      console.log('Response:', response.data);
      if (pageNo === 1) {
        setOrders(response.data.content);
      } else {
        setOrders(prevOrders => [...prevOrders, ...response.data.content]);
      }
      setLoading(false);
    })
    .catch(error => {
      // Handle error
      console.error('Error:', error);
      setLoading(false);
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
    }, [firstLoad, getAllOrders])
  );

  const loadMoreOrders = () => {
    if (!loading) {
      setPageNo(pageNo + 1);
      setLoading(true);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ marginBottom: 6, borderWidth: 1, marginHorizontal: 10 }}>
      <Text>Order ID: {item.orderId}</Text>
      <Text>Ship Date: {item.shipDate}</Text>
      <Text>Order Date: {item.orderDate}</Text>
      <Text>Total Amount: {item.totalAmount}</Text>
      <Text>Total Qty: {item.totalQty}</Text>
      <Text>Customer Name: {item.customerName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <Text>Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.orderId ? item.orderId.toString() : index.toString()}
        onEndReached={loadMoreOrders}
        onEndReachedThreshold={0.1}
        refreshing={loading}
        onRefresh={() => {
          setPageNo(1);
        }}
      />
    </View>
  );
};

export default Order;
