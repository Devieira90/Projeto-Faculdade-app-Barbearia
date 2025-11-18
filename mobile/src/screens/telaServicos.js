import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 

  ActivityIndicator,
  Alert, 
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/footer';
import axios from 'axios';
import {collection,addDoc,getDocs} from 'firebase/firestore';
import {db} from '../config/firebaseConfig';
import { styles } from '../estilos/styleScreenServicos';
import {SafeAreaView} from 'react-native-safe-area-context';



const dadosMock = [
  { id: 1, nome: 'Corte de Cabelo', duracao: 30, preco: 25.00, descricao: 'Corte tradicional masculino.' },
  { id: 2, nome: 'Barba', duracao: 15, preco: 15.00, descricao: 'Aparar e modelar a barba.' },
  { id: 3, nome: 'Corte Infantil', duracao: 25, preco: 20.00, descricao: 'Corte especial para crianças.' },
];




const TelaSelecaoServico = () => {  
  const navigation = useNavigation();
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const salvarServicosNoFirestore = async () => {
  try {
    setLoading(false);
    const servicosRef = collection(db, "servicos");

    for (const s of dadosMock) {
      await addDoc(servicosRef, {
        nome: s.nome,
        duracao: s.duracao,
        preco: s.preco,
        descricao: s.descricao,
      });
    }

    Alert.alert("Sucesso", "Serviços adicionados ao Firestore!");
  } catch (error) {
    console.error("Erro ao salvar serviços:", error);
    Alert.alert("Erro", "Não foi possível salvar os serviços.");
  }
};

  const fetchServicos = async () => {
      try {
        setLoading(true);
        const servicosSnapshot = await getDocs(collection(db, 'servicos'));
        const servicosList = servicosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Serviços buscados:', servicosList);
        setServicos(servicosList);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar serviços:', err);
        setError('Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

   
  const imageButton = require('../../../assets/button02.png');



  // Buscar serviços quando a tela carregar
  useEffect(() => {
  
  
  
     fetchServicos();
  
  }

   
  , []);

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


export default TelaSelecaoServico;