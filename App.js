import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppRoute from './src/routes/stackRoute';



import DashBoard from './src/screens/admin/dashBoard';



export default function App() {
  return (
   
<AppRoute />
//<DashBoard/>
   
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
