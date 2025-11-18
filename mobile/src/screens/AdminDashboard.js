import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [adminName, setAdminName] = useState('');

  // Efeito para buscar o nome do administrador ao carregar a tela
  useEffect(() => {
    const fetchAdminData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Busca o nome do admin na coleção 'users' (se existir)
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setAdminName(userDocSnap.data().nome);
        }
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    auth.signOut();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Administrativo</Text>
        <Text style={styles.subtitle}>Bem-vindo, {adminName || 'Admin'}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('GerenciarServicos')} // Navegará para a tela de serviços
        >
          <Text style={styles.menuButtonText}>Gerenciar Serviços</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('GerenciarBarbeiros')} // Navegará para a tela de barbeiros
        >
          <Text style={styles.menuButtonText}>Gerenciar Barbeiros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('VerAgendamentos')} // Navegará para a tela de agendamentos
        >
          <Text style={styles.menuButtonText}>Ver Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#c0392b', marginTop: 30 }]}
          onPress={handleLogout}
        >
          <Text style={styles.menuButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5e8c6ff', padding: 20 },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#555' },
  menuContainer: { width: '100%' },
  menuButton: {
    backgroundColor: '#7c672eff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  menuButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

export default AdminDashboard;