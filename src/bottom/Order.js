import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
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
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getAllOrders = useCallback(() => {
    setLoading(true);
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
        console.error('Error:', error);
      })
      .finally(() => {
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
    }, [firstLoad, getAllOrders]),
  );

  const loadMoreOrders = () => {
    if (!loading) {
      setPageNo(pageNo + 1);
      setLoading(true);
    }
  };

  const renderItem = ({item}) => {
    if (!item) return null; // Add null check here

    return (
      <View style={style.container}>
        <TouchableOpacity
          style={style.header}
          onPress={() => setSelectedOrder(item)}>
          <View style={style.ordheader}>
            <View style={style.ordshpheader}>
              <Text>Order Date: {item.orderDate}</Text>
              <Text>Ship Date: {item.shipDate}</Text>
            </View>
            <View style={style.custtlheader}>
              <Text style={{flex: 0.9}}>
                Customer Name: {item.customerName}
              </Text>
              <Text>Total Amount: {item.totalAmount}</Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  backgroundColor:
                    item.orderStatus.toLowerCase() === 'open'
                      ? '#FF3333'
                      : 'green',
                  padding: 5,
                  color: '#fff',
                  borderRadius: 5,
                  marginHorizontal: 10,
                }}>
                Status - {item.orderStatus}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Text style={{marginHorizontal: 10, marginVertical: 5}}>Orders</Text>
      {loading && orders.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#390050"
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item && item.orderId ? item.orderId.toString() : index.toString()
          }
          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          onRefresh={() => {
            setPageNo(1);
          }}
        />
      )}
      {selectedOrder && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={style.modalContainer}>
            <View style={style.modalContent}>
              <View style={style.custtlheader}>
                <Text>OrderId:{selectedOrder.orderId}</Text>
                <Text>TotalQty:{selectedOrder.totalQty}</Text>
              </View>
              <View style={style.modelordshpheader}>
                <Text>Order Date: {selectedOrder.orderDate}</Text>
                <Text>Ship Date: {selectedOrder.shipDate}</Text>
              </View>
              <View style={style.custtlheader}>
                <Text style={{flex: 0.9}}>
                  Customer Name: {selectedOrder.customerName}
                </Text>
                <Text>Total Amount: {selectedOrder.totalAmount}</Text>
              </View>
              <Text style={{textAlign: 'right', marginHorizontal: 10}}>
                Status: {selectedOrder.orderStatus}
              </Text>
              <TouchableOpacity
                style={style.closeButton}
                onPress={() => setSelectedOrder(null)}>
                <Text style={{color: '#fff'}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  ordheader: {
    marginVertical: 5,
  },
  ordshpheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  modelordshpheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  custtlheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    width: '95%',
    padding: 5,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#390050',
    padding: 10,
    borderRadius: 5,
  },
});

export default Order;
