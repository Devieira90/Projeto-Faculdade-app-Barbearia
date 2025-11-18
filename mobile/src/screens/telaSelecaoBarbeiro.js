import React, { useState ,useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {collection,addDoc,getDocs} from 'firebase/firestore';
import {db} from '../config/firebaseConfig';
import { styles } from '../estilos/styleScreenBarbeiro';
import {SafeAreaView} from 'react-native-safe-area-context';



import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.107:3000'
const dadosBarbeirosMock = [
  { id: '1', nome: 'João Silva', especialidade: 'Cortes Masculinos' },
  { id: '2', nome: 'Carlos Souza', especialidade: 'Barba e Bigode' },
  { id: '3', nome: 'Pedro Oliveira', especialidade: 'Cortes Infantis' },
];
const TelaSelecaoBarbeiro = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 // O serviço selecionado da tela anterior
  const { servico } = route.params; 
  const [barbeiros, setBarbeiros] = useState([]);
  
  const [barbeiroSelecionadoId, setBarbeiroSelecionadoId] = useState(null);
  
  const imageBarbeiro = require('../../../assets/barbeiro.jpg');
    //³³³³³³³³³³³³³³³³³³³³³³
   const salvarBarbeirosNoFirestore = async () => {
    try {
      setLoading(false);
      const barbeirosRef = collection(db, "barbeiros");
  
      for (const s of dadosBarbeirosMock) {
        await addDoc(barbeirosRef, {
          nome: s.nome,
          especialidade: s.especialidade,
        });
      }
  
      Alert.alert("Sucesso", "Barbeiros adicionados ao Firestore!");
    } catch (error) {
      console.error("Erro ao salvar Barbeiros:", error);
      Alert.alert("Erro", "Não foi possível salvar os serviços.");
    }
  };



  
// Função para buscar barbeiros da API DESCOMNETAR 

  const fetchBarbeiros = async () =>{
      
    try{
       setLoading(true);
       setError(null);
        console.log('Buscando barbeiros...');
        const barbeirosSnapshot = await  getDocs(collection (db,'barbeiros'));
        const barbeirosList = barbeirosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBarbeiros(barbeirosList);
        setLoading (false);

    }catch(error){
      console.log('Erro ao buscar barbeiros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os barbeiros. Tente novamente mais tarde.');
    }finally{
       setLoading(false);
    }
  };

   // Buscar serviços quando a tela carregar
    useEffect(() => {
      //salvarBarbeirosNoFirestore();
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



export default TelaSelecaoBarbeiro;