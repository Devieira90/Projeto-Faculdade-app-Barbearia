import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppRoute from './src/routes/stackRoute';


import BarberManagement from './src/screens/admin/barberManagement';
import TelaAdm from './src/screens/telaAdm';



export default function App() {
  return (
   
<AppRoute />

   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
