import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/footer';
import axios from 'axios';

// URL base do seu servidor - IMPORTANTE ajustar conforme o ambiente
const API_BASE_URL = 'http://192.168.1.107:3000' // Produção

const TelaSelecaoServico = () => {  
  const navigation = useNavigation();
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar serviços do backend
  const fetchServicos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/servicos`);
      console.log('Serviços recebidos:', response.data);
      setServicos(response.data);
      setLoading(false);
    }catch (err) {
      console.error('Erro ao buscar serviços:', err);
      setError('Não foi possível carregar os serviços. Verifique sua conexão.');
      Alert.alert('Erro', 'Não foi possível carregar os serviços', fetchServicos);
      setServicos([]); // Limpa a lista em caso de erro
    }
  }


  // Buscar serviços quando a tela carregar
  useEffect(() => {
    fetchServicos();
  }, []);

  const handleSelectService = (serviceId) => {
    setServicoSelecionadoId(serviceId);
    goToNextStep();
  };

  const goToNextStep = () => {
    if (servicoSelecionadoId) {
      const servicoCompleto = servicos.find(s => s.id === servicoSelecionadoId);
      if (servicoCompleto) {
        navigation.navigate('SelecaoBarbeiro', { servico: servicoCompleto });
      }
    }
  };

  // Componente de loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando serviços...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Componente de erro
  if (error && servicos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Erro ao carregar serviços</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchServicos}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    const isSelected = item.id === servicoSelecionadoId;
    
    return (
      <TouchableOpacity
        style={[styles.card, isSelected ]}
        onPress={() => handleSelectService(item.id)}
        
      >
        <View style={styles.infoContainer}>
          <Text style={styles.nomeServico}>{item.nome}</Text>
          <Text style={styles.detalheServico}>Duração: {item.duracao} min</Text>
          {item.descricao && (
            <Text style={styles.descricaoServico}>{item.descricao}</Text>
          )}
        </View>
        <View style={styles.precoContainer}>
          <Text style={styles.preco}>R$ {item.preco.toFixed(2).replace('.', ',')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Selecione o Serviço</Text>
      
      <FlatList
        data={servicos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
          </View>
        }
      />

    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0ead6' 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    padding: 20, 
    color: '#333',
    textAlign: 'center'
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: '#B8860B',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: '#fff',
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
  },
  nomeServico: {
    fontSize: 16,
    fontWeight: '600',
    color: '#36332C',
  },
  detalheServico: {
    fontSize: 13,
    color:'#36332C',
    marginTop: 4,
  },
  descricaoServico: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
  },
  precoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0EAD6',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TelaSelecaoServico;