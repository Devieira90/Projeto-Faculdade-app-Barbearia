import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button
} from 'react-native';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GerenciarBarbeiros = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBarbeiros = async () => {
    try {
      setLoading(true);
      const barbeirosSnapshot = await getDocs(collection(db, 'barbeiros'));
      const barbeirosList = barbeirosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBarbeiros(barbeirosList);
    } catch (err) {
      console.error('Erro ao buscar barbeiros:', err);
      Alert.alert('Erro', 'Não foi possível carregar os barbeiros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchBarbeiros();
    }
  }, [isFocused]);

  const handleEdit = (barbeiro) => {
    navigation.navigate('FormBarbeiro', { barbeiro });
  };

  const handleDelete = (barbeiroId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este barbeiro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'barbeiros', barbeiroId));
              Alert.alert('Sucesso', 'Barbeiro excluído com sucesso!');
              fetchBarbeiros(); // Atualiza a lista
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o barbeiro.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Barbeiros</Text>
        <Button
          title="Adicionar Novo"
          onPress={() => navigation.navigate('FormBarbeiro')}
        />
      </View>
      <FlatList
        data={barbeiros}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              {item.especialidade && <Text>{item.especialidade}</Text>}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0f0f0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold' },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginVertical: 5, backgroundColor: '#fff', borderRadius: 5, elevation: 2 },
  info: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'column', justifyContent: 'space-around' },
  edit: { color: 'blue', marginBottom: 10 },
  delete: { color: 'red' },
});

export default GerenciarBarbeiros;