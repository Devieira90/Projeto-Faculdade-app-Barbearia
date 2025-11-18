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
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { styles } from '../estilos/stylePainel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TelaPainelUsuario = ({ navigation, onLogout }) => {
  const [user, setUser] = useState(null); // Estado para o usuário autenticado
  const [initializing, setInitializing] = useState(true); // Estado para a verificação inicial de auth
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const isFocused = useIsFocused(); // Hook para verificar se a tela está em foco

  // Efeito para ouvir o estado de autenticação
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      if (initializing) {
        setInitializing(false);
      }
    });
    // Limpa o listener ao desmontar
    return unsubscribeAuth;
  }, []);

  const fetchUserData = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        setNomeUsuario(userDocSnap.data().nome);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // A busca de dados agora é em tempo real, mas podemos forçar a busca de usuário
    fetchUserData().finally(() => setRefreshing(false));
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

  // Navega para o fluxo de admin
  const navigateToAdmin = () => {
    navigation.navigate('AdminFlow');
  };

  // Efeito para buscar os dados quando a tela está em foco e o usuário está logado
  useEffect(() => {
    // Só executa se a verificação inicial de auth terminou
    if (initializing) return;

    if (isFocused && user) {
      fetchUserData();
  
      console.log(`[DIAGNÓSTICO] Iniciando busca de agendamentos para o usuário: ${user.uid}`);

      setLoading(true);
      const q = query(collection(db, "agendamentos"), where("userId", "==", user.uid));
  
      // Inicia o listener em tempo real
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.metadata.hasPendingWrites) {
          console.log("[DIAGNÓSTICO] Ignorando atualização local (hasPendingWrites).");
          return;
        }

        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Ordenar por data (mais recentes primeiro)
        lista.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        console.log(`[DIAGNÓSTICO] Agendamentos encontrados: ${lista.length}.`);

        setAgendamentos(lista);
        setLoading(false);
      }, (error) => {
        console.error("!!!!!!!!!! ERRO GRAVE NO LISTENER DO FIRESTORE !!!!!!!!!!");
        console.error("Erro no listener do Firestore:", {
          message: error.message,
          code: error.code,
        });
        setLoading(false);
      });
  
      // Função de limpeza: para o listener quando a tela perde o foco ou é desmontada
      return () => unsubscribe();
    } else if (!user) {
      // Limpa os dados se o usuário fizer logout
      setAgendamentos([]);
      setNomeUsuario('');
      setLoading(false); // Garante que o loading pare se o usuário deslogar
    }
  }, [isFocused, user, initializing]); // Re-executa quando o foco, usuário ou estado de inicialização mudam

  const fetchAgendamentosManualmente = () => {
    // Esta função pode ser usada no botão de refresh se o onSnapshot não for suficiente
  }

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const navigateToDetalhes = (agendamentoId) => {
    // Navega para a tela de detalhes, passando o ID do agendamento como parâmetro
    navigation.navigate('DetalhesAgendamento', { agendamentoId });
  };

  // Mostra um indicador de loading global enquanto verifica a autenticação inicial
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.titulo}>appBarbearia</Text>
          <Text style={styles.nomeUsuario}>{nomeUsuario || user?.email}</Text>
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
            <TouchableOpacity onPress={onRefresh}>
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
                <TouchableOpacity onPress={() => navigateToDetalhes(item.id)}>
                  <View style={[
                    styles.card,
                    index === 0 && styles.firstCard,
                    index === agendamentos.length - 1 && styles.lastCard
                  ]}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitulo}>{item.servico?.nome || 'Serviço não informado'}</Text>
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
                        <Text style={styles.cardTexto}>Barbeiro: {item.barbeiro?.nome || 'Não informado'}</Text>
                      </View>
                      
                      <View style={styles.infoRow}>
                        <Icon name="event" size={16} color="#666" />
                        <Text style={styles.cardTexto}>Data: {formatarData(item.data)}</Text>
                      </View>
                      
                      <View style={styles.infoRow}>
                        <Icon name="schedule" size={16} color="#666" />
                        <Text style={styles.cardTexto}>Hora: {item.horario}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
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
          <Text style={styles.textBotao}>Agendar</Text>
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