import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaSelecaoServico from '../screens/telaServicos';
import TelaSelecaoBarbeiro from '../screens/telaSelecaoBarbeiro';
import TelaSelecaoDataHora from '../screens/telaDataHora';
import LoginScreen from '../screens/telaLoguin';
import TelaPainelUsuario from '../screens/telaPainelUsuario';
import TelaMaps from '../screens/telaMaps';


const Stack = createNativeStackNavigator();

export default function AppRoute() {
  const [isLogged, setIsLogged] = useState(false); // controla se o login foi feito

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* MOSTRA O LOGIN COMO MODAL ENQUANTO NÃO ESTIVER LOGADO */}
        {!isLogged ? (
          <Stack.Screen
            name="LoginModal"
            options={{
              presentation: 'modal', // <-- transforma a tela em modal
            }}
          >
            {(props) => (
              <LoginScreen {...props} onLogin={() => setIsLogged(true)} />
            )}
          </Stack.Screen>

        ) : (
          <>
            {/* Resto da aplicação APÓS o login */}
  <Stack.Screen name="PainelUsuario">
  {(props) => (
    <TelaPainelUsuario {...props} onLogout={() => setIsLogged(false)} />
  )}
</Stack.Screen>



            <Stack.Screen name="Home" component={TelaSelecaoServico} />
            <Stack.Screen name="SelecaoBarbeiro" component={TelaSelecaoBarbeiro} />
            <Stack.Screen name="SelecaoDataHora" component={TelaSelecaoDataHora} />
            <Stack.Screen name="Local" component={TelaMaps} />

           
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
