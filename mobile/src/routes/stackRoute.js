import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaSelecaoServico from '../screens/telaServicos';
import TelaSelecaoBarbeiro from '../screens/telaSelecaoBarbeiro';
import TelaSelecaoDataHora from '../screens/telaDataHora';
import LoginScreen from '../screens/telaLoguin';
import TelaPainelUsuario from '../screens/telaPainelUsuario'; // Corrigindo o caminho da importação
import CadastroScreen from '../screens/Cadastro'; // Importa a tela de Cadastro
import TelaMaps from '../screens/telaMaps';
// Importando as telas de Administrador
import AdminLogin from '../screens/AdminLogin';
import AdminDashboard from '../screens/AdminDashboard';
import GerenciarServicos from '../screens/GerenciarServicos';
import GerenciarBarbeiros from '../screens/GerenciarBarbeiros'; // Importando a nova tela
import FormServico from '../screens/FormServico'; // Importando o formulário
import FormBarbeiro from '../screens/FormBarbeiro';
import VerAgendamentos from '../screens/VerAgendamentos'; // Importando a tela de agendamentos
import DetalhesAgendamento from '../screens/DetalhesAgendamento'; // Importando a nova tela
import ForgotPasswordScreen from '../screens/ForgotPassword'; // Importando a tela de esqueci a senha
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { ActivityIndicator, View } from 'react-native';


const Stack = createNativeStackNavigator();

// Cole aqui o UID do seu usuário administrador que você criou no Firebase Authentication
const ADMIN_UID = "OboV6W7tDVg75v16MHCy16kxGLN2";

// Stacks separados para cada fluxo
const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PainelUsuario">
      {(props) => <TelaPainelUsuario {...props} onLogout={() => auth.signOut()} />}
    </Stack.Screen>
    <Stack.Screen name="Home" component={TelaSelecaoServico} />
    <Stack.Screen name="SelecaoBarbeiro" component={TelaSelecaoBarbeiro} />
    <Stack.Screen name="SelecaoDataHora" component={TelaSelecaoDataHora} />
    <Stack.Screen name="Local" component={TelaMaps} />
    <Stack.Screen name="DetalhesAgendamento" component={DetalhesAgendamento} options={{ headerShown: true, title: 'Detalhes do Agendamento' }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
    <Stack.Screen name="LoginModal" component={LoginScreen} />
    <Stack.Screen name="Register" component={CadastroScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="AdminLogin" component={AdminLogin} options={{ headerShown: true, title: 'Login do Admin' }} />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Painel do Admin' }} />
    <Stack.Screen name="GerenciarServicos" component={GerenciarServicos} options={{ title: 'Gerenciar Serviços' }} />
    <Stack.Screen name="GerenciarBarbeiros" component={GerenciarBarbeiros} options={{ title: 'Gerenciar Barbeiros' }} />
    <Stack.Screen name="FormServico" component={FormServico} />
    <Stack.Screen name="FormBarbeiro" component={FormBarbeiro} />
    <Stack.Screen name="VerAgendamentos" component={VerAgendamentos} options={{ title: 'Agenda dos Barbeiros' }} />
  </Stack.Navigator>
);


export default function AppRoute() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listener unificado para o estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Verifica se o UID do usuário logado corresponde ao UID do administrador
        if (firebaseUser.uid === ADMIN_UID) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        // Se não há usuário, não é admin
        setIsAdmin(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAdmin ? (
          <Stack.Screen name="AdminFlow" component={AdminStack} />
        ) : user ? (
          <Stack.Screen name="UserFlow" component={UserStack} />
        ) : (
          <Stack.Screen name="AuthFlow" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
