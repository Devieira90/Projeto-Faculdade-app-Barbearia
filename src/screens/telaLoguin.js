import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert, // Usado para mostrar uma mensagem simples de login
  KeyboardAvoidingView, // Componente importante para evitar que o teclado cubra os inputs
  Platform // Para adaptar o KeyboardAvoidingView
} from 'react-native';
import AppRoute from '../routes/stackRoute';
import { useNavigation } from '@react-navigation/native'; 

const LoginScreen = () => {
   const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica de autenticação: Aqui você faria uma chamada para sua API
    if (email === 'teste@teste.com' && password === '123456') {
      navigation.navigate('Home'); // Navega para a tela principal após o login bem-sucedido
    } else {
      Alert.alert('Erro', 'E-mail ou senha inválidos.');
    }
  };

  return (
    // KeyboardAvoidingView ajusta a tela quando o teclado abre
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          secureTextEntry // Esconde o texto da senha
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>

       <TouchableOpacity>
        <Text style={styles.forgotPassword}>Ainda Nao Sou Cadastrado</Text>
      </TouchableOpacity>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz com que ocupe a tela inteira
    backgroundColor: '#f5f5f5', // Cor de fundo suave
    alignItems: 'center', // Centraliza itens horizontalmente
    justifyContent: 'center', // Centraliza itens verticalmente
    paddingHorizontal: 30,
  },
  titleContainer: {
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    // Adicionando uma sombra leve (aplica-se apenas à caixa do input)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Sombra para Android
  },
  button: {
    backgroundColor: '#007bff', // Azul primário
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    // Sombra mais forte no botão para dar profundidade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Sombra para Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
    paddingTop: 10,
  },
});

// Exporta o componente
export default LoginScreen;