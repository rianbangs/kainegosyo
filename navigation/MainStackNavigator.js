import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ordering from '../components/Ordering';
import Cashiering from '../components/Cashiering';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Ordering">
        <Stack.Screen name="Ordering" component={Ordering} />
        <Stack.Screen name="Cashiering" component={Cashiering} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;