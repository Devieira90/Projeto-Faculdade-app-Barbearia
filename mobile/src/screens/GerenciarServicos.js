import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GerenciarServicos = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook para saber se a tela está em foco
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServicos = async () => {
    try {
      setLoading(true);
      const servicosSnapshot = await getDocs(collection(db, 'servicos'));
      const servicosList = servicosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServicos(servicosList);
    } catch (err) {
      console.error('Erro ao buscar serviços:', err);
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
    } finally {
      setLoading(false);
    }
  };

  // Recarrega os serviços sempre que a tela recebe foco
  useEffect(() => {
    if (isFocused) {
      fetchServicos();
    }
  }, [isFocused]);

  const handleEdit = (servico) => {
    // Navega para uma tela de formulário, passando o serviço para edição
    navigation.navigate('FormServico', { servico });
  };

  const handleDelete = (servicoId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'servicos', servicoId));
              Alert.alert('Sucesso', 'Serviço excluído com sucesso!');
              fetchServicos(); // Atualiza a lista
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o serviço.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Serviços</Text>
        <Button
          title="Adicionar Novo"
          onPress={() => navigation.navigate('FormServico')} // Navega para o formulário para criar um novo
          color="#7c672eff"
        />
      </View>
      <FlatList
        data={servicos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text>Preço: R$ {parseFloat(item.preco).toFixed(2)}</Text>
              <Text>Duração: {item.duracao} min</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}><Text style={styles.edit}>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={styles.delete}>Excluir</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// Adicione estilos básicos ou crie um novo arquivo de estilo
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5e8c6ff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold' },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginVertical: 5, backgroundColor: '#fff', borderRadius: 5, elevation: 2 },
  info: { flex: 1, justifyContent: 'center' },
  nome: { fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'column', justifyContent: 'space-around' },
  edit: { color: '#7c672eff', marginBottom: 10, fontWeight: 'bold' },
  delete: { color: 'red' },
});

export default GerenciarServicos;