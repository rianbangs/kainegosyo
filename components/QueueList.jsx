import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

export default function QueueList() {
  const [selectedTab, setSelectedTab] = useState('All Orders');

  const orders = [
    { id: 'A105', name: 'John Smith', time: '10:30 AM', wait: 12, items: 2, status: 'Waiting' },
    { id: 'A106', name: 'Sarah Wilson', time: '10:35 AM', wait: 8, items: 1, status: 'In Progress' },
    { id: 'A107', name: 'Michael Brown', time: '10:40 AM', wait: 5, items: 3, status: 'Ready' },
    { id: 'A108', name: 'Emma Davis', time: '10:45 AM', wait: 3, items: 2, status: 'Waiting' },
    { id: 'A109', name: 'James Wilson', time: '10:50 AM', wait: 1, items: 4, status: 'In Progress' },
    { id: 'A110', name: 'John Smith', time: '10:30 AM', wait: 12, items: 2, status: 'Waiting' },
    { id: 'A111', name: 'Sarah Wilson', time: '10:35 AM', wait: 8, items: 1, status: 'In Progress' },
    { id: 'A112', name: 'Michael Brown', time: '10:40 AM', wait: 5, items: 3, status: 'Ready' },
    { id: 'A113', name: 'Emma Davis', time: '10:45 AM', wait: 3, items: 2, status: 'Waiting' },
    { id: 'A114', name: 'James Wilson', time: '10:50 AM', wait: 1, items: 4, status: 'In Progress' },  
];

  // Calculate dynamic summary data
  const totalWaiting = orders.filter((order) => order.status === 'Waiting').length;
  const averageWait =
    orders.reduce((total, order) => total + order.wait, 0) / orders.length || 0;
  const nextCall = orders.find((order) => order.status === 'Waiting')?.id || 'N/A';

  const tabs = ['All Orders', 'Waiting', 'In Progress', 'Ready'];

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderCard, styles[`status${item.status.replace(' ', '')}`]]}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={styles.orderName}>{item.name}</Text>
      <View style={styles.orderDetails}>
        <Text style={styles.orderTime}>{item.time}</Text>
        <Text style={styles.orderWait}>Wait: {item.wait} min</Text>
        <Text style={styles.orderItems}>{item.items} items</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Queue List</Text>
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Waiting: {totalWaiting}</Text>
        <Text style={styles.summaryText}>Average Wait: {averageWait.toFixed(1)} min</Text>
        <Text style={styles.summaryText}>Next Call: #{nextCall}</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders.filter((order) => selectedTab === 'All Orders' || order.status === selectedTab)}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 120,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#555',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
  },
  orderList: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statusWaiting: {
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
  },
  statusInProgress: {
    borderLeftWidth: 5,
    borderLeftColor: '#17a2b8',
  },
  statusReady: {
    borderLeftWidth: 5,
    borderLeftColor: '#28a745',
  },
  orderName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderTime: {
    fontSize: 12,
    color: '#555',
  },
  orderWait: {
    fontSize: 12,
    color: '#555',
  },
  orderItems: {
    fontSize: 12,
    color: '#555',
  },
});