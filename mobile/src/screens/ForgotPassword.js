import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState(route.params?.email || '');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, insira seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Verifique seu E-mail',
        'Um link para redefinir sua senha foi enviado para o seu e-mail.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Nenhum usuário encontrado com este e-mail.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
        source={require('../../../assets/logo.png')}
        style={[styles.logo, { width: 300, height: 120 }]}
      />
      <Text style={styles.title}>Redefinir Senha</Text>
      <Text style={styles.subtitle}>
        Insira seu e-mail para receber um link de redefinição.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar Link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5e8c6ff' },
  logo: { marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 30, textAlign: 'center' },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#7c672eff', padding: 15, borderRadius: 10, alignItems: 'center', width: '100%', elevation: 3 },
  buttonDisabled: { backgroundColor: '#a89a74' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backText: { marginTop: 20, color: '#555', fontSize: 16, textDecorationLine: 'underline' },
});

export default ForgotPasswordScreen;