import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';




const AppTelaCRUD = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'João Silva', email: 'joao@email.com' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Limpar formulário
  const clearForm = () => {
    setFormData({ name: '', email: '' });
    setEditingUser(null);
  };

  // Abrir modal para criar novo usuário
  const handleCreate = () => {
    clearForm();
    setModalVisible(true);
  };

  // Abrir modal para editar usuário
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingUser(user);
    setModalVisible(true);
  };

  // Salvar usuário (create ou update)
  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (editingUser) {
      // Update
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, name: formData.name, email: formData.email }
          : user
      ));
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
    } else {
      // Create
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email
      };
      setUsers([...users, newUser]);
      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
    }

    setModalVisible(false);
    clearForm();
  };

  // Deletar usuário
  const handleDelete = (user) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u.id !== user.id));
            Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
          }
        }
      ]
    );
  };

  // Renderizar item da lista
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Icon name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6200ee" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CRUD de Usuários</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de usuários */}
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
          <Text style={styles.emptySubtext}>Clique no + para adicionar</Text>
        </View>
      )}

      {/* Modal para criar/editar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Digite o nome"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  placeholder="Digite o email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>
                    {editingUser ? 'Atualizar' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  header: {
    backgroundColor: '#6200ee',
    padding: 16,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#03dac6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ffa000',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#6200ee',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AppTelaCRUD;