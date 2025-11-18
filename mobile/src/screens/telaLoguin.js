import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { styles } from '../estilos/styleScreenLogin';
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  // Efeito para resetar o estado de loading quando a tela recebe foco
  React.useEffect(() => {
    if (isFocused) {
      setLoading(false);
    }
  }, [isFocused]);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log('Usuário logado:', userCredential.user.email);

      // A navegação será tratada automaticamente pelo listener em AppRoute
    } catch (error) {
      setLoading(false);

      let errorMessage = 'Ocorreu um erro desconhecido. Tente novamente.';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      } else if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        errorMessage = 'E-mail ou senha inválidos.';
      }

      Alert.alert('Erro de Login', errorMessage);

    } finally {
      setLoading(false);
    }
  };

  const isWeb = Platform.OS === 'web';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      {...(isWeb ? { className: 'login-container' } : {})}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bem-vindo!</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Entrando...' : 'ENTRAR'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.forgotPassword}>Ainda Não Sou Cadastrado</Text>
      </TouchableOpacity>

      {/* Botão para login de admin */}
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate('AdminLogin')}
      ><Text style={[styles.forgotPassword, { textDecorationLine: 'underline' }]}>Acesso Administrativo</Text></TouchableOpacity>
    </KeyboardAvoidingView>
  );
};



export default LoginScreen;
