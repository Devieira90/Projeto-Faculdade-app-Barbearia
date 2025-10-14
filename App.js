import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppRoute from './src/routes/stackRoute';

import AppTelaCRUD from './src/screens/crudScreen';



export default function App() {
  return (
    <AppRoute />
   //<AppTelaCRUD />
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
