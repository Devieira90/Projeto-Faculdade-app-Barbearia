import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { collection, getDocs, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

const VerAgendamentos = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);

  // Busca a lista de barbeiros uma vez
  useEffect(() => {
    const fetchBarbeiros = async () => {
      try {
        const barbeirosSnapshot = await getDocs(collection(db, 'barbeiros'));
        const barbeirosList = barbeirosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBarbeiros(barbeirosList);
      } catch (error) {
        console.error("Erro ao buscar barbeiros:", error);
      } finally {
        setLoadingBarbeiros(false);
      }
    };
    fetchBarbeiros();
  }, []);

  // Inicia o listener para agendamentos quando um barbeiro é selecionado
  useEffect(() => {
    if (!selectedBarbeiro) {
      setAgendamentos([]);
      return;
    }

    setLoadingAgendamentos(true);
    const q = query(
      collection(db, "agendamentos"),
      where("barbeiro.id", "==", selectedBarbeiro.id),
      orderBy("data", "desc") // Ordena por data, mais recentes primeiro
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAgendamentos(lista);
      setLoadingAgendamentos(false);
    }, (error) => {
      console.error("Erro ao buscar agendamentos:", error);
      setLoadingAgendamentos(false);
    });

    // Limpa o listener ao desmontar ou ao trocar de barbeiro
    return () => unsubscribe();
  }, [selectedBarbeiro]);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Seletor de Barbeiros */}
      <View style={styles.barberSelector}>
        <Text style={styles.sectionTitle}>Selecione um Barbeiro</Text>
        {loadingBarbeiros ? (
          <ActivityIndicator color="#7c672eff" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {barbeiros.map(barbeiro => (
              <TouchableOpacity
                key={barbeiro.id}
                style={[
                  styles.barberButton,
                  selectedBarbeiro?.id === barbeiro.id && styles.barberButtonSelected,
                ]}
                onPress={() => setSelectedBarbeiro(barbeiro)}
              >
                <Text style={[
                  styles.barberButtonText,
                  selectedBarbeiro?.id === barbeiro.id && styles.barberButtonTextSelected
                ]}>{barbeiro.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Lista de Agendamentos */}
      <FlatList
        data={agendamentos}
        keyExtractor={item => item.id}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Agenda</Text>}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loadingAgendamentos ? (
              <ActivityIndicator size="large" color="#7c672eff" />
            ) : (
              <Text style={styles.emptyText}>
                {selectedBarbeiro ? 'Nenhum agendamento encontrado para este barbeiro.' : 'Selecione um barbeiro para ver a agenda.'}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.servico?.nome || 'Serviço'}</Text>
            <Text>Cliente: {item.userName || 'Não informado'}</Text>
            <Text>Data: {formatarData(item.data)} - {item.horario}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  barberSelector: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  barberButton: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#ddd' },
  barberButtonSelected: { backgroundColor: '#7c672eff', borderColor: '#7c672eff' },
  barberButtonText: { color: '#333' },
  barberButtonTextSelected: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 15, borderRadius: 10, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  emptyContainer: { marginTop: 50, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
});

export default VerAgendamentos;