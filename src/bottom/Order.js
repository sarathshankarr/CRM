import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import axios from "axios";
import { API } from "../config/apiConfig";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = () => {
    axios.post(API.GET_ALL_ORDER, {
      pageNo: "1",
      pageSize: "20",
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
      setOrders(response.data.content);
    })
    .catch(error => {
      // Handle error
      console.error('Error:', error);
    });
  };

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 20 }}>
      <Text>Order ID: {item.orderId}</Text>
      <Text>Ship Date{item.shipDate}</Text>
      <Text>Order Date: {item.orderDate}</Text>
      <Text>Total Amount: {item.totalAmount}</Text>
      <Text>Total Qty:{item.totalQty}</Text>
      <Text>Customer Name: {item.customerName}</Text>
    </View>
  );

  return (
    <View>
      <Text>Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.orderId.toString()}
      />
    </View>
  );
};

export default Order;
