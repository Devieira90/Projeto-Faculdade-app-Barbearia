import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Supondo que você usa React Navigation
import Footer from '../components/footer';

// Dados de exemplo (Mockup de como viria do Backend)
const DADOS_SERVICOS = [
  { id: '1', nome: 'Corte Masculino', preco: 45.00, duracao: 40 },
  { id: '2', nome: 'Barba Clássica', preco: 35.00, duracao: 30 },
  { id: '3', nome: 'Completo (Corte + Barba)', preco: 75.00, duracao: 70 },
  { id: '4', nome: 'Hidratação Capilar', preco: 25.00, duracao: 20 },
];

const TelaSelecaoServico  = () => {  
  const navigation = useNavigation();
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState(null);

  const handleSelectService = (serviceId) => {
    setServicoSelecionadoId(serviceId);
  };

  const goToNextStep = () => {
    if (servicoSelecionadoId) {
      const servicoCompleto = DADOS_SERVICOS.find(s => s.id === servicoSelecionadoId);
      // Navega para a próxima tela, passando o serviço
      navigation.navigate('SelecaoBarbeiro', { servico: servicoCompleto });
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === servicoSelecionadoId;
    
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => handleSelectService(item.id)}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.nomeServico}>{item.nome}</Text>
          <Text style={styles.detalheServico}>Duração: {item.duracao} min</Text>
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
        data={DADOS_SERVICOS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }} // Espaço para o botão
      />

      {servicoSelecionadoId && (
       
          <Footer onPress={goToNextStep} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7cb9bbff' },
  titulo: { fontSize: 22, fontWeight: 'bold', padding: 20, color: '#333' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: '#fff', // Borda padrão
  },
  selectedCard: {
    borderColor: '#007AFF', // Borda ao ser selecionado
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
  },
  nomeServico: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detalheServico: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  precoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
 
});

export default TelaSelecaoServico ;