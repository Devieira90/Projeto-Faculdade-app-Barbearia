import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Button, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Footer from '../components/footer';

// Dados de exemplo (Mockup de como viria do Backend)
const DADOS_BARBEIROS = [
  { id: '101', nome: 'Carlos Silva', fotoURL: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=CS', especialidade: 'Clássico e Barba' },
  { id: '102', nome: 'André Santos', fotoURL: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=AS', especialidade: 'Estilos Modernos (Fade)' },
  { id: '103', nome: 'Bia Oliveira', fotoURL: 'https://via.placeholder.com/150/3CB371/FFFFFF?text=BO', especialidade: 'Coloração e Texturização' },
  // Opção especial: "Qualquer" para facilitar a vida do usuário
  { id: '0', nome: 'Qualquer Profissional', fotoURL: 'https://via.placeholder.com/150/A9A9A9/FFFFFF?text=??', especialidade: 'Primeiro horário disponível' },
];

const TelaSelecaoBarbeiro = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // O serviço selecionado da tela anterior
  const { servico } = route.params; 
  
  const [barbeiroSelecionadoId, setBarbeiroSelecionadoId] = useState(null);

  const handleSelectBarber = (barberId) => {
    setBarbeiroSelecionadoId(barberId);
  };

  const goToNextStep = () => {
    if (barbeiroSelecionadoId) {
      const barbeiroCompleto = DADOS_BARBEIROS.find(b => b.id === barbeiroSelecionadoId);
      
      navigation.navigate('SelecaoDataHora', { 
        servico: servico, 
        barbeiro: barbeiroCompleto 
      });
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === barbeiroSelecionadoId;
    
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => handleSelectBarber(item.id)}
      >
        <Image 
          source={{ uri: item.fotoURL }} 
          style={styles.barberImage} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nomeBarbeiro}>{item.nome}</Text>
          <Text style={styles.especialidade}>{item.especialidade}</Text>
        </View>
        {isSelected && <Text style={styles.checkIcon}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Barbeiro para "{servico.nome}"</Text>
      
      <FlatList
        data={DADOS_BARBEIROS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {barbeiroSelecionadoId && (
         <Footer onPress={goToNextStep} />
      )}
    </SafeAreaView>
  );
};

// ... (Estilos, apenas os novos/modificados)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  titulo: { fontSize: 18, fontWeight: 'bold', padding: 15, color: '#333' }, // Reduzido para caber o nome do serviço
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
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
  barberImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular
    marginRight: 15,
    backgroundColor: '#ccc'
  },
  infoContainer: {
    flex: 1,
  },
  nomeBarbeiro: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  especialidade: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  checkIcon: {
    fontSize: 24,
    color: '#007AFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },

});

export default TelaSelecaoBarbeiro;