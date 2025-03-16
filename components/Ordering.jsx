import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [order, setOrder] = useState([
    { id: '1', name: 'Grilled Salmon', price: 51.8, quantity: 2 },
    { id: '2', name: 'Caesar Salad', price: 12.5, quantity: 1 },
    { id: '3', name: 'Iced Tea', price: 3.5, quantity: 1 },
  ]);

  const [menuItems] = useState([
    { id: '1', name: 'Grilled Salmon', price: 25.9, image: require('../assets/favicon.png') },
    { id: '2', name: 'Beef Burger', price: 18.9, image: require('../assets/favicon.png') },
    { id: '3', name: 'Caesar Salad', price: 12.5, image: require('../assets/favicon.png') },
    { id: '4', name: 'Pasta Carbonara', price: 16.9, image: require('../assets/favicon.png') },
    { id: '5', name: 'Fish & Chips', price: 19.9, image: require('../assets/favicon.png') },
    { id: '6', name: 'Margherita Pizza', price: 15.9, image: require('../assets/favicon.png') },
  ]);

  const updateQuantity = (id, type) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.id === id
          ? { ...item, quantity: type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setOrder((prevOrder) => prevOrder.filter((item) => item.id !== id));
  };

  const addToOrder = (item) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((orderItem) => orderItem.id === item.id);
      if (existingItem) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      return [...prevOrder, { ...item, quantity: 1 }];
    });
  };

  const getTotalPrice = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')}>
        <Ionicons name="remove" size={20} color="black" />
      </TouchableOpacity>
      <Text style={styles.quantity}>{item.quantity}</Text>
      <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
        <Ionicons name="add" size={20} color="black" />
      </TouchableOpacity>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.menuText}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => addToOrder(item)} style={styles.addButton}>
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={[{ key: 'order' }, { key: 'menu' }]} // Add sections
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => {
        if (item.key === 'order') {
          return (
            <>
              <Text style={styles.header}>Order Picking</Text>
              <Text style={styles.subHeader}>Order #1234</Text>
              <Text style={styles.subText}>2:45 PM Table #15</Text>

              <FlatList
                data={order}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
              />
              <Text style={styles.subtotal}>Total Items: {order.length}</Text>
              <Text style={styles.subtotal}>Subtotal: ${getTotalPrice()}</Text>
            </>
          );
        } else if (item.key === 'menu') {
          return (
            <>
              <Text style={styles.categoryHeader}>Menu</Text>
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={renderMenuItem}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.clearButton} onPress={() => setOrder([])}>
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.payButton}>
                  <Text style={styles.buttonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </>
          );
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  subText: { color: 'gray', marginBottom: 15 },
  orderItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, width: '100%' },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  itemName: { flex: 1, fontSize: 16 },
  price: { fontWeight: 'bold' },
  categoryHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  menuItem: { flex: 1, alignItems: 'center', margin: 10, width: '45%' },
  image: { width: '100%', height: 100, borderRadius: 10 },
  menuText: { fontSize: 16, marginTop: 5 },
  addButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  clearButton: { backgroundColor: 'red', padding: 10, borderRadius: 5 },
  payButton: { backgroundColor: 'green', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  subtotal: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
});
