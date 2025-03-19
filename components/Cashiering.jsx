import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Cashiering({ route }) {
  const { order, orderNumber, tableNumber, time } = route.params;

  const getTotalPrice = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const getTax = () => {
    return (getTotalPrice() * 0.08).toFixed(2);
  };

  const getTotalWithTax = () => {
    return (parseFloat(getTotalPrice()) + parseFloat(getTax())).toFixed(2);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity>
          <Ionicons name="remove-circle-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Cashier</Text>
        <Text style={styles.subHeader}>Order #{orderNumber}</Text>
        <Text style={styles.subText}>{time} Table #{tableNumber}</Text>
      </View>

      <FlatList
        data={order}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderList}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Subtotal: ${getTotalPrice()}</Text>
        <Text style={styles.summaryText}>Tax (8%): ${getTax()}</Text>
        <Text style={styles.totalText}>Total: ${getTotalWithTax()}</Text>
      </View>

      <TouchableOpacity style={styles.completePaymentButton}>
        <Text style={styles.completePaymentButtonText}>Complete Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  subText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  orderList: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completePaymentButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  completePaymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});