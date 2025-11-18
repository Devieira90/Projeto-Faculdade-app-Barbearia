import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Styles } from '../components/styles'; // Importando seus estilos globais
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    // Validação simples
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      console.log('Usuário cadastrado com sucesso:', userCredential.user.email);

      // Salva o nome do usuário no Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        nome: nome,
        email: email,
      });
      console.log('Informações do usuário salvas no Firestore.');

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() } // Volta para a tela de login após o sucesso
      ]);

    } catch (error) {
      console.error("Erro no cadastro:", error.code);
      let errorMessage = 'Ocorreu um erro ao tentar cadastrar. Tente novamente.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso por outra conta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Ela deve ter no mínimo 6 caracteres.';
      }

      Alert.alert('Erro no Cadastro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>Crie sua Conta</Text>

      <TextInput
        style={localStyles.input}
        placeholder="Nome Completo"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
        editable={!loading}
      />

      <TextInput
        style={localStyles.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={localStyles.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity style={[Styles.button, loading && localStyles.buttonDisabled]} onPress={handleCadastro} disabled={loading}>
        <Text style={Styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={localStyles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={localStyles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  }
});