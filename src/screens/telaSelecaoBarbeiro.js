import React, { useState ,useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Button, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';



import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.107:3000'
const TelaSelecaoBarbeiro = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 // O serviço selecionado da tela anterior
  const { servico } = route.params; 
  
  const [barbeiroSelecionadoId, setBarbeiroSelecionadoId] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const imageBarbeiro = require('../../assets/barbeiro.jpg');
  


  const fetchBarbeiros = async () =>{
      
    try{
       setLoading(true);
       setError(null);
        console.log('Buscando barbeiros...');
        const response = await axios.get(`${API_BASE_URL}/api/barbeiros`);
        console.log(response.status)
        console.log('Barbeiros recebidos:', response.data);
        setBarbeiros(response.data);
    


    }catch(error){
      console.log('Erro ao buscar barbeiros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os barbeiros. Tente novamente mais tarde.');
    }finally{
       setLoading(false);
    }
  };

   // Buscar serviços quando a tela carregar
    useEffect(() => {
      fetchBarbeiros ();
    }, []);
  
  
 

 
    

    const handleSelectBarber = (barberId) => {
  setBarbeiroSelecionadoId(barberId);
  const barbeiroCompleto = barbeiros.find(b => b.id === barberId);

  navigation.navigate('SelecaoDataHora', { 
    servico: servico, 
    barbeiro: barbeiroCompleto 
  });
};

    
  



  const renderItem = ({ item }) => {
    const isSelected = item.id === barbeiroSelecionadoId;
    
    return (
      <TouchableOpacity
        style={styles.card }
        onPress={() => handleSelectBarber(item.id)}
      >
        <Image 
          source={imageBarbeiro} 
          style={styles.barberImage} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nomeBarbeiro}>{item.nome}</Text>
          <Text style={styles.especialidade}>{item.especialidade}</Text>
        </View>
      
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.titulo}>PROFICIONAL :</Text>
      
      <FlatList
        data={barbeiros}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      
    </SafeAreaView>
  );
};

// ... (Estilos, apenas os novos/modificados)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5e8c6ff' },
  titulo: { fontSize: 18, fontWeight: 'bold', padding: 15, color: '#333' }, // Reduzido para caber o nome do serviço
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 25,
    marginVertical: 8,
    backgroundColor: '#7c672eff',
    borderRadius: 8,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    borderWidth: 4,
    borderColor: '#251702ff',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#fffafaff',
  },
  especialidade: {
    fontSize: 20,
    color: '#e7e3e3ff',
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