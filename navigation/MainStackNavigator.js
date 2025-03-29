import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ordering from '../components/Ordering';
import Cashiering from '../components/Cashiering';
import QueueList from '../components/QueueList';  

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Ordering">
        <Stack.Screen name="Ordering" component={Ordering} />
        <Stack.Screen name="Cashiering" component={Cashiering} />
        <Stack.Screen name="QueueList" component={QueueList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;