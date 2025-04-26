import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Cashiering({ route }) {
  const { order: initialOrder, orderNumber, tableNumber, time,customerName } = route.params;
  const [order, setOrder] = useState(initialOrder);
  const [modalVisible, setModalVisible] = useState(false);
  const [amountTendered, setAmountTendered] = useState('');
  const [change, setChange] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [currentPerson, setCurrentPerson] = useState(1);
  const [splitSelections, setSplitSelections] = useState([]); // Tracks selected items for splitting
  const [splitTotals, setSplitTotals] = useState([]); // Tracks totals for each person
  const [personNames, setPersonNames] = useState({}); // Tracks names of each person

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  


  const navigation = useNavigation();

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

  const getTotalPrice = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const getTax = () => {
    return (getTotalPrice() * 0.08).toFixed(2);
  };

  const getTotalWithTax = () => {
    return (parseFloat(getTotalPrice()) + parseFloat(getTax())).toFixed(2);
  };

  const handlePayment = () => {
    // navigation.navigate('QueueList', {
    //   order,
    //   orderNumber: '1234',
    //   tableNumber: '5',
    //   time: '2:45 PM',
    //   customerName,
    // });
  };


  const handleCashPayment = () => {
    const total = parseFloat(getTotalPrice());
    const tendered = parseFloat(amountTendered);

    if (!isNaN(tendered) && tendered >= total) {
      setChange((tendered - total).toFixed(2));
      setModalVisible(false);
    } else {       
      setErrorMessage('Amount tendered must be greater than or equal to the total.');
      setErrorModalVisible(true);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        {/* <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')}>
          <Ionicons name="remove-circle-outline" size={24} color="black" />
        </TouchableOpacity> */}
        <Text style={styles.quantity}>{item.quantity}x</Text>
        {/* <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity> */}
      </View>
      {/* <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Cashier</Text>
        <Text style={styles.subHeader}>Order #{orderNumber}</Text>
        <Text style={styles.subText}>{time} Table #{tableNumber}</Text>
        <Text style={styles.subHeader}>Customer: {customerName}</Text>
      </View>

      <FlatList
        data={order}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderList}
      />

      <View style={styles.summaryContainer}>
        {/* <Text style={styles.summaryText}>Subtotal: ${getTotalPrice()}</Text>
        <Text style={styles.summaryText}>Tax (8%): ${getTax()}</Text>
        <Text style={styles.totalText}>Total: ${getTotalWithTax()}</Text> */}
        <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
        {selectedPaymentMethod === 'Cash' && amountTendered ? (
          <Text style={styles.summaryText}>
              Amount Tendered:  <Text style={{ color: 'blue' }}>${amountTendered}</Text>
          </Text>
        ) : null}
        {selectedPaymentMethod === 'Cash' && change !== null ? (
          <Text style={styles.summaryText}>
              Change: <Text style={{ color: 'red' }}>${change}</Text>
          </Text>
        ) : null}
        {selectedPaymentMethod === 'Split Bill' && splitTotals.length > 0 ? (
            splitTotals.map(({ person, total }) => (
              <Text key={person} style={styles.summaryText}>
                {person}: <Text style={{ color: 'green' }}>${total.toFixed(2)}</Text>
              </Text>
            ))
          ) : null}
      </View>

      <View style={styles.paymentOptionsContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => {
            setSelectedPaymentMethod('Cash');
            setModalVisible(true);
          }}
        >
          <Ionicons name="cash-outline" size={32} color="blue" />
          <Text style={styles.paymentOptionText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setSelectedPaymentMethod('Card')}
        >
          <Ionicons name="card-outline" size={32} color="blue" />
          <Text style={styles.paymentOptionText}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setSelectedPaymentMethod('Digital Wallet')}
        >
          <Ionicons name="wallet-outline" size={32} color="blue" />
          <Text style={styles.paymentOptionText}>Digital Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => {
            setSelectedPaymentMethod('Split Bill');
            setSplitModalVisible(true);
          }}
        >
          <Ionicons name="calculator-outline" size={32} color="blue" />
          <Text style={styles.paymentOptionText}>Split Bill</Text>
        </TouchableOpacity>
     </View>

      {/* <TouchableOpacity style={styles.completePaymentButton} onPress={handlePayment}>
        <Text style={styles.completePaymentButtonText}>Payment</Text>
      </TouchableOpacity> */}

      {/* Modal for Cash Payment */}
      <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Amount Tendered</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                placeholder="Enter amount"
                value={amountTendered}
                onChangeText={setAmountTendered}
              />
              <View style={styles.modalButtonContainer}>
                <Button title="Proceed" onPress={handleCashPayment} />
                <View style={styles.buttonSpacing} />
                <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>

        {/*This modal will ask the user to input the number of people splitting the bill. */} 
        <Modal
          visible={splitModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSplitModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Number of People</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                placeholder="Number of People"
                value={numberOfPeople.toString()}
                onChangeText={(value) => setNumberOfPeople(parseInt(value, 10) || 0)}
              />
              <View style={styles.modalButtonContainer}>
                <Button
                  title="Proceed"
                  onPress={() => {
                    if (numberOfPeople > 0) {
                      setSplitSelections(new Array(order.length).fill(null)); // Initialize selections
                      setCurrentPerson(1); // Start with the first person
                      setSplitModalVisible(false);
                      setAssignModalVisible(true); // Open the assign modal
                    } else {
                      setErrorMessage('Please enter a valid number of people.');
                      setErrorModalVisible(true);
                    }
                  }}
                />
                <View style={styles.buttonSpacing} />
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => setSplitModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/*This modal will ask the user to assign items to each person. */}
        <Modal
          visible={assignModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAssignModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Assign Items to Person</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={`Enter name for Person #${currentPerson}`}
                value={personNames[currentPerson] || ''}
                onChangeText={(value) => {
                  setPersonNames((prev) => ({ ...prev, [currentPerson]: value }));
                }}
              />
              <FlatList
                data={order.filter((item) => {
                  const assignedPersons = splitSelections[item.id] || [];
                  return assignedPersons.length < item.quantity; // Show only items not fully covered
                })}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.splitItemContainer}>
                    <Text>{item.name}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        splitSelections[item.id]?.includes(currentPerson) && styles.checkboxChecked, // Highlight if already assigned
                      ]}
                      onPress={() => {
                        const updatedSelections = { ...splitSelections };
                        if (!updatedSelections[item.id]) {
                          updatedSelections[item.id] = [];
                        }
                        if (updatedSelections[item.id].includes(currentPerson)) {
                          // If already assigned, remove the person
                          updatedSelections[item.id] = updatedSelections[item.id].filter(
                            (person) => person !== currentPerson
                          );
                        } else {
                          // Otherwise, assign the item to the current person
                          updatedSelections[item.id].push(currentPerson);
                        }
                        setSplitSelections(updatedSelections);
                      }}
                    >
                      <Text style={styles.checkboxText}>
                        {splitSelections[item.id]?.includes(currentPerson) ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={<Text>No items to assign.</Text>}
              />
              <View style={styles.modalButtonContainer}>
              <Button
                title={currentPerson < numberOfPeople ? 'Next Person' : 'Finish'}
                onPress={() => {
                  if (!personNames[currentPerson]) {
                    setErrorMessage('Please enter a name for this person.');
                    setErrorModalVisible(true);
                    return;
                  }
                  if (currentPerson < numberOfPeople) {
                    setCurrentPerson(currentPerson + 1); // Move to the next person
                  } else {
                    // Calculate totals and close the modal
                    const totals = {};
                      Object.entries(splitSelections).forEach(([itemId, persons]) => {
                        if (persons) {
                          const item = order.find((orderItem) => orderItem.id.toString() === itemId);
                          if (item) {
                            const sharedCost = (item.price * item.quantity) / persons.length; // Divide cost by the number of people sharing
                            persons.forEach((person) => {
                              if (!totals[person]) totals[person] = 0;
                              totals[person] += sharedCost;
                            });
                          }
                        }
                      });
                    setSplitTotals(
                      Object.entries(totals).map(([person, total]) => ({
                        person: personNames[person] || `Person #${person}`,
                        total,
                      }))
                    );
                    setAssignModalVisible(false);
                  }
                }}
              />
              <View style={styles.buttonSpacing} />
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => setAssignModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Error Modal */}
        <Modal
          visible={errorModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setErrorModalVisible(false)}
        >
          <View style={styles.errorModalContainer}>
            <View style={styles.errorModalContent}>
              <Text style={styles.errorModalTitle}>Opps!</Text>
              <Text style={styles.errorModalMessage}>{errorMessage}</Text>
              <Button
                title="Close"
                onPress={() => setErrorModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
      errorModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      errorModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
      },
      errorModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'red',
      },
      errorModalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
      },
      checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
      },
      checkboxChecked: {
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
      checkboxText: {
        color: 'white',
        fontWeight: 'bold',
      },
       assignButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
      },
      assignButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      splitItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      splitInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: 60,
        textAlign: 'center',
      },
      modalButtonContainer: {
        flexDirection: 'row', // Arrange buttons in a row
        justifyContent: 'space-between', // Add space between buttons
        width: '100%', // Ensure buttons take up full width
        marginTop: 10, // Add some spacing above the buttons
      },
      buttonSpacing: {
        width: 10, // Add spacing between the buttons
      },
        modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',        
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 10,
        textAlign: 'center',
      },
    paymentOptionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap', // Allows wrapping into multiple rows
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    paymentOption: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d3d3d3', // Set background color to grey
      padding: 15,
      borderRadius: 10,
      width: '48%', // Adjust width to fit 2 columns
      marginBottom: 10, // Add spacing between rows
      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 0.2, // Shadow opacity
      shadowRadius: 4, // Shadow blur radius
      elevation: 5, // Elevation for Android shadow
  },
  paymentOptionText: {
    marginTop: 5,
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
  },
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
    fontWeight: 'bold',
    fontSize: 16,
    color: 'red',
  },
  summaryContainer: {
    marginBottom: 60,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
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