import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Suas telas
import TelaSelecaoServico from '../screens/telaServicos';
import TelaSelecaoBarbeiro from '../screens/telaSelecaoBarbeiro';
import TelaSelecaoDataHora from '../screens/telaDataHora';
import LoginScreen from '../screens/telaLoguin';
const Stack = createNativeStackNavigator();

export default function AppRoute() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={TelaSelecaoServico } />
        <Stack.Screen name="SelecaoBarbeiro" component={TelaSelecaoBarbeiro } />
        <Stack.Screen name="SelecaoDataHora" component={TelaSelecaoDataHora } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
