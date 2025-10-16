// BarberManagement.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Modal,
  Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// URL base do seu servidor - IMPORTANTE ajustar conforme o ambiente
const API_BASE_URL = 'http://192.168.1.107:3000'
const BarberManagement = () => {
  //const navigation = useNavigation();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  
  // Estados para novo barbeiro
  const [newBarber, setNewBarber] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: ''
  });

  // Estados para edição
  const [editBarber, setEditBarber] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: ''
  });

  // Buscar barbeiros
  const fetchBarbers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/barbeiros`);
      // Remover duplicatas baseado no email ou ID
      const uniqueBarbers = removeDuplicates(response.data, 'email');

      console.log('Barbeiros recebidos:', uniqueBarbers);
      setBarbers(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os barbeiros');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para remover duplicatas
  const removeDuplicates = (array, key) => {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => t[key] === item[key])
    );
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  // Adicionar novo barbeiro
  const handleAddBarber = async () => {
    if (!newBarber.name || !newBarber.email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/barbeiros`, newBarber);
      setBarbers([...barbers, response.data]);
      setModalVisible(false);
      setNewBarber({ name: '', email: '', phone: '', specialty: '' });
      Alert.alert('Sucesso', 'Barbeiro adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o barbeiro');
      console.error(error);
    }
  };

  // Editar barbeiro
  const handleEditBarber = async () => {
    if (!editBarber.name || !editBarber.email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    try {
      const response = await api.put(`${API_BASE_URL}/api/barbeiros/${selectedBarber.id}`, editBarber);
      const updatedBarbers = barbers.map(barber =>
        barber.id === selectedBarber.id ? response.data : barber
      );
      setBarbers(updatedBarbers);
      setEditModalVisible(false);
      Alert.alert('Sucesso', 'Barbeiro atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o barbeiro');
      console.error(error);
    }
  };

  // Excluir barbeiro
  const handleDeleteBarber = (barber) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir ${barber.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`${API_BASE_URL}/api/barbeiros/${barber.id}`);
              const filteredBarbers = barbers.filter(b => b.id !== barber.id);
              setBarbers(filteredBarbers);
              Alert.alert('Sucesso', 'Barbeiro excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o barbeiro');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  // Abrir modal de edição
  const openEditModal = (barber) => {
    setSelectedBarber(barber);
    setEditBarber({
      name: barber.name,
      email: barber.email,
      phone: barber.phone || '',
      specialty: barber.specialty || ''
    });
    setEditModalVisible(true);
  };

  // Renderizar item da lista
  const renderBarberItem = ({ item }) => (
    <View style={styles.barberCard}>
      <View style={styles.barberInfo}>
        <Text style={styles.barberName}>{item.nome}</Text>
        <Text style={styles.barberEmail}>{item.especialidades}</Text>
       
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteBarber(item)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Barbeiros</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={barbers}
        renderItem={renderBarberItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchBarbers();
        }}
        contentContainerStyle={styles.list}
      />

      {/* Modal para Adicionar Barbeiro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Barbeiro</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newBarber.name}
              onChangeText={(text) => setNewBarber({...newBarber, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newBarber.email}
              onChangeText={(text) => setNewBarber({...newBarber, email: text})}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Telefone (opcional)"
              value={newBarber.phone}
              onChangeText={(text) => setNewBarber({...newBarber, phone: text})}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Especialidade (opcional)"
              value={newBarber.specialty}
              onChangeText={(text) => setNewBarber({...newBarber, specialty: text})}
            />
            
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Salvar" onPress={handleAddBarber} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Editar Barbeiro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Barbeiro</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={editBarber.name}
              onChangeText={(text) => setEditBarber({...editBarber, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editBarber.email}
              onChangeText={(text) => setEditBarber({...editBarber, email: text})}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={editBarber.phone}
              onChangeText={(text) => setEditBarber({...editBarber, phone: text})}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Especialidade"
              value={editBarber.specialty}
              onChangeText={(text) => setEditBarber({...editBarber, specialty: text})}
            />
            
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setEditModalVisible(false)} />
              <Button title="Atualizar" onPress={handleEditBarber} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  barberCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#681414ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barberInfo: {
    marginBottom: 12,
  },
  barberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  barberEmail: {
    fontSize: 14,
    color: '#c71313ff',
    marginBottom: 2,
  },
  barberPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  barberSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default BarberManagement;