import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const AdminLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Agora usa a autenticação real do Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // O listener em stackRoute.js cuidará da navegação.
    } catch (error) {
      Alert.alert('Erro de Login', 'Email ou senha de administrador incorretos.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso Restrito</Text>
      <Text style={styles.subtitle}>Login do Administrador</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email do Administrador"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5e8c6ff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3e3535ff', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#555', marginBottom: 40 },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 10, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  loginButton: { backgroundColor: '#7c672eff', padding: 20, borderRadius: 10, alignItems: 'center', width: '100%', elevation: 3 },
  loginButtonDisabled: { backgroundColor: '#a08c5b' },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

export default AdminLogin;