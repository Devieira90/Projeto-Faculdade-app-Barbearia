import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

const FormBarbeiro = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const barbeiroParaEditar = route.params?.barbeiro;

  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (barbeiroParaEditar) {
      navigation.setOptions({ title: 'Editar Barbeiro' });
      setNome(barbeiroParaEditar.nome);
      setEspecialidade(barbeiroParaEditar.especialidade || '');
    } else {
      navigation.setOptions({ title: 'Adicionar Barbeiro' });
    }
  }, [barbeiroParaEditar, navigation]);

  const handleSave = async () => {
    if (!nome) {
      Alert.alert('Atenção', 'O nome do barbeiro é obrigatório.');
      return;
    }

    setLoading(true);

    try {
      const barbeiroData = {
        nome,
        especialidade,
      };

      if (barbeiroParaEditar) {
        const barbeiroRef = doc(db, 'barbeiros', barbeiroParaEditar.id);
        await setDoc(barbeiroRef, barbeiroData, { merge: true });
        Alert.alert('Sucesso', 'Barbeiro atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'barbeiros'), barbeiroData);
        Alert.alert('Sucesso', 'Barbeiro adicionado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar barbeiro:', error);
      Alert.alert('Erro', 'Não foi possível salvar o barbeiro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Nome do Barbeiro</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: João da Silva"
          />

          <Text style={styles.label}>Especialidade (Opcional)</Text>
          <TextInput
            style={styles.input}
            value={especialidade}
            onChangeText={setEspecialidade}
            placeholder="Ex: Cortes clássicos, Barba"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Salvar" onPress={handleSave} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
});

export default FormBarbeiro;