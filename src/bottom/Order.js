import React, { useEffect, useState, useCallback } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { API } from "../config/apiConfig";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const getAllOrders = () => {
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
      setOrders(prevOrders => [...prevOrders, ...response.data.content]);
    })
    .catch(error => {
      // Handle error
      console.error('Error:', error);
    });
  };

  useEffect(() => {
    getAllOrders();
  }, [pageNo, pageSize]);

  // Use useFocusEffect to refresh orders when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      setOrders([]);
      setPageNo(1);
    }, [])
  );

  const loadMoreOrders = () => {
    setPageNo(pageNo + 1);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ marginBottom: 6,borderWidth:1,marginHorizontal:10}}>
      <Text>Order ID: {item.orderId}</Text>
      <Text>Ship Date: {item.shipDate}</Text>
      <Text>Order Date: {item.orderDate}</Text>
      <Text>Total Amount: {item.totalAmount}</Text>
      <Text>Total Qty: {item.totalQty}</Text>
      <Text>Customer Name: {item.customerName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{backgroundColor:"#fff"}}>
      <Text>Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.orderId.toString()}
        onEndReached={loadMoreOrders}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default Order;
