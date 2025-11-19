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
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VerAgendamentos = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([]);
  const [mostrarAntigos, setMostrarAntigos] = useState(false);
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const isFocused = useIsFocused();

  // Busca a lista de barbeiros sempre que a tela está em foco
  useEffect(() => {
    const fetchBarbeiros = async () => {
      setLoadingBarbeiros(true);
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

    if (isFocused) {
      fetchBarbeiros();
    }
  }, [isFocused]);

  // Inicia o listener para agendamentos quando um barbeiro é selecionado
  useEffect(() => {
    if (!selectedBarbeiro) {
      setAgendamentos([]);
      return;
    }

    setLoadingAgendamentos(true);

    // Cria duas consultas: uma para cada formato de dado
    const queryNovoFormato = query(
      collection(db, "agendamentos"),
      where("barbeiro.id", "==", selectedBarbeiro.id)
    );
    const queryFormatoAntigo = query(
      collection(db, "agendamentos"),
      where("barbeiroId", "==", selectedBarbeiro.id)
    );

    // Variáveis para guardar os resultados de cada listener
    let agendamentosNovoFormato = [];
    let agendamentosFormatoAntigo = [];

    // Função para combinar os resultados e atualizar o estado
    const combinarEAtualizar = () => {
      const todosAgendamentos = [
        ...agendamentosNovoFormato,
        ...agendamentosFormatoAntigo,
      ];
      const mapa = new Map(todosAgendamentos.map(item => [item.id, item]));
      const listaUnica = Array.from(mapa.values());
      setAgendamentos(listaUnica);
      setLoadingAgendamentos(false);
    };

    // Listener para o formato novo
    const unsubNovo = onSnapshot(queryNovoFormato, (snapNovo) => {
      agendamentosNovoFormato = snapNovo.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      combinarEAtualizar();
    }, (error) => console.error("Erro ao buscar agendamentos (novo formato):", error));

    // Listener para o formato antigo
    const unsubAntigo = onSnapshot(queryFormatoAntigo, (snapAntigo) => {
      agendamentosFormatoAntigo = snapAntigo.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      combinarEAtualizar();
    }, (error) => console.error("Erro ao buscar agendamentos (formato antigo):", error));

    // Limpa o listener ao desmontar ou ao trocar de barbeiro
    return () => {
      unsubNovo();
      unsubAntigo();
    };
  }, [selectedBarbeiro]);

  // Efeito para filtrar os agendamentos (futuros vs. antigos)
  useEffect(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera o tempo para comparar apenas a data

    const filtrados = agendamentos.filter(item => {
      // Converte a data 'YYYY-MM-DD' para um objeto Date sem problemas de fuso horário
      // A data do Firestore vem como string 'YYYY-MM-DD'. Para comparar corretamente,
      // precisamos garantir que ela seja tratada como UTC para evitar problemas de fuso.
      const [ano, mes, dia] = item.data.split('-').map(Number);
      const dataAgendamento = new Date(Date.UTC(ano, mes - 1, dia));

      if (mostrarAntigos) {
        return dataAgendamento < hoje; // Mostra agendamentos passados
      } else {
        return dataAgendamento >= hoje; // Mostra agendamentos de hoje e futuros
      }
    });

    // Ordena a lista
    filtrados.sort((a, b) => {
      if (mostrarAntigos) {
        // Para antigos, o mais recente primeiro
        return new Date(b.data) - new Date(a.data);
      }
      // Para futuros, o mais próximo primeiro
      return new Date(a.data) - new Date(b.data);
    });

    setAgendamentosFiltrados(filtrados);
  }, [agendamentos, mostrarAntigos]);

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
        data={agendamentosFiltrados}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>{mostrarAntigos ? 'Agendamentos Antigos' : 'Próximos Agendamentos'}</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loadingAgendamentos ? (
              <ActivityIndicator size="large" color="#7c672eff" />
            ) : (
              <Text style={styles.emptyText}>
                {selectedBarbeiro ? `Nenhum agendamento ${mostrarAntigos ? 'antigo' : 'futuro'} encontrado.` : 'Selecione um barbeiro.'}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.servico?.nome || 'Serviço'}</Text>
            <Text style={styles.cardText}>Cliente: {item.userName || 'Não informado'}</Text>
            <Text>Data: {formatarData(item.data)} - {item.horario}</Text>
          </View>
        )}
      />

      {/* Botão Flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMostrarAntigos(!mostrarAntigos)}
      >
        <Icon name={mostrarAntigos ? "event" : "history"} size={24} color="#fff" />
      </TouchableOpacity>
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
  cardText: { fontSize: 14, color: '#333', marginBottom: 3 },
  emptyContainer: { marginTop: 50, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#7c672eff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default VerAgendamentos;