import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import Ordering from './components/Ordering';

// //to download the node modules, run npm install in the terminal

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Ordering />
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React from 'react';
import MainStackNavigator from './navigation/MainStackNavigator';

export default function App() {
  return <MainStackNavigator />;
}
