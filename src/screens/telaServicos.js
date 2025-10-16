import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  Alert, 
  ImageBackground
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

   
  const imageButton = require('../../assets/button02.png');
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
    const servicoCompleto = servicos.find(s => s.id === serviceId);
    navigation.navigate('SelecaoBarbeiro', { servico: servicoCompleto });
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

      <ImageBackground
        source={imageButton}
        imageStyle={{ borderRadius: 10 }}
        style={styles.gradient}
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
         </ImageBackground>
      
      </TouchableOpacity>
   
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.titulo}> SERVIÇOS</Text>

      
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
    backgroundColor: '#ece0b6ff' 
  },
  
    gradient: {
    borderRadius: 2,
   // opcional
    
    width: '107%',
    height: '100%',
  },

  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    padding: 20, 
    color: '#3d1502ff',
    textAlign: 'center'
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    marginHorizontal: 25,
    marginVertical: 8,
    backgroundColor: '#B8860B',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#130f0fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 4,
    borderColor: '#8a6533ff',
    
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
  
  },
  nomeServico: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a2902ff',
  },
  detalheServico: {
    fontSize: 14,
    color:'#fffcf6ff',
    marginTop: 4,
    fontWeight: 'bold',
  },
  descricaoServico: {
    fontSize: 14,
    color: '#ffffffff',
    marginTop: 2,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  precoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 30,
  },
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f3eeebff',
    alignItems: 'left',
    marginRight: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'left',
    padding: 16,
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