import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  ScrollView,
  RefreshControl 
} from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { styles } from '../estilos/stylePainel';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TelaPainelUsuario = ({ navigation, onLogout }) => {
  const user = auth.currentUser;
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgendamentos = async () => {
    try {
      const q = query(
        collection(db, "agendamentos"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const lista = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ordenar por data (mais recente primeiro)
      lista.sort((a, b) => new Date(a.data) - new Date(b.data));
      setAgendamentos(lista);
    } catch (error) {
      console.log("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAgendamentos();
  };

  const handleLogout = () => {
    auth.signOut();
    onLogout();
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const navigateToLocal = () => {
    // Aqui você pode navegar para a tela de endereço depois
    navigation.navigate('Local');
    // Ou preparar para implementação futura:
    // alert('Funcionalidade de Local em desenvolvimento');
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.titulo}>appBarbearia</Text>
          <Text style={styles.nomeUsuario}>{user?.email}</Text>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
           <Text style={{ color: '#FFF' }}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.subtitulo}>Seus Agendamentos</Text>
            <TouchableOpacity onPress={fetchAgendamentos}>
              <Icon name="refresh" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Carregando agendamentos...</Text>
            </View>
          ) : agendamentos.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="event-busy" size={64} color="#CCCCCC" />
              <Text style={styles.semAgendamento}>Nenhum agendamento encontrado</Text>
              <Text style={styles.emptySubtitle}>
                Que tal agendar um horário na barbearia?
              </Text>
              <TouchableOpacity 
                style={styles.botaoAgendar} 
                onPress={navigateToHome}
              >
                <Text style={styles.textAgendar}>Fazer Agendamento</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={agendamentos}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={[
                  styles.card,
                  index === 0 && styles.firstCard,
                  index === agendamentos.length - 1 && styles.lastCard
                ]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitulo}>{item.servico}</Text>
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: new Date(item.data) >= new Date() ? '#4CAF50' : '#9E9E9E' }
                    ]}>
                      <Text style={styles.statusText}>
                        {new Date(item.data) >= new Date() ? 'Agendado' : 'Realizado'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.infoRow}>
                      <Icon name="person" size={16} color="#666" />
                      <Text style={styles.cardTexto}>Barbeiro: {item.barbeiro}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Icon name="event" size={16} color="#666" />
                      <Text style={styles.cardTexto}>Data: {formatarData(item.data)}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Icon name="schedule" size={16} color="#666" />
                      <Text style={styles.cardTexto}>Hora: {item.hora}</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Footer com Botões */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.botao, styles.botaoHome]} 
          onPress={navigateToHome}
        >
          <Icon name="home" size={20} color="#FFF" />
          <Text style={styles.textBotao}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botao, styles.botaoLocal]} 
          onPress={navigateToLocal}
        >
          <Icon name="place" size={20} color="#FFF" />
          <Text style={styles.textBotao}>Local</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TelaPainelUsuario;