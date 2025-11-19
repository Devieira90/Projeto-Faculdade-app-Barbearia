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

const FormServico = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const servicoParaEditar = route.params?.servico; // Pega o serviço passado por parâmetro

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  // Preenche o formulário se estiver em modo de edição
  useEffect(() => {
    if (servicoParaEditar) {
      navigation.setOptions({ title: 'Editar Serviço' });
      setNome(servicoParaEditar.nome);
      setPreco(String(servicoParaEditar.preco));
      setDuracao(String(servicoParaEditar.duracao));
      setDescricao(servicoParaEditar.descricao || '');
    } else {
      navigation.setOptions({ title: 'Adicionar Serviço' });
    }
  }, [servicoParaEditar, navigation]);

  const handleSave = async () => {
    if (!nome || !preco || !duracao) {
      Alert.alert('Atenção', 'Por favor, preencha nome, preço e duração.');
      return;
    }

    setLoading(true);

    try {
      const servicoData = {
        nome,
        preco: parseFloat(preco),
        duracao: parseInt(duracao, 10),
        descricao,
      };

      if (servicoParaEditar) {
        // Atualiza um serviço existente
        const servicoRef = doc(db, 'servicos', servicoParaEditar.id);
        await setDoc(servicoRef, servicoData, { merge: true });
        Alert.alert('Sucesso', 'Serviço atualizado com sucesso!');
      } else {
        // Adiciona um novo serviço
        await addDoc(collection(db, 'servicos'), servicoData);
        Alert.alert('Sucesso', 'Serviço adicionado com sucesso!');
      }
      navigation.goBack(); // Volta para a tela anterior
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      Alert.alert('Erro', 'Não foi possível salvar o serviço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Nome do Serviço</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Corte de Cabelo"
          />

          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            value={preco}
            onChangeText={setPreco}
            placeholder="Ex: 25.00"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Duração (minutos)</Text>
          <TextInput
            style={styles.input}
            value={duracao}
            onChangeText={setDuracao}
            placeholder="Ex: 30"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Descrição (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Detalhes do serviço"
            multiline
          />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Salvar" onPress={handleSave} color="#7c672eff" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5e8c6ff' },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 100, textAlignVertical: 'top' },
});

export default FormServico;