import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.107:3000';

const TelaAdm = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao: ''
  });

  // Buscar serviços
  const fetchServicos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/servicos`);
      setServicos(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  // Deletar serviço
  const handleDelete = (servicoId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteServico(servicoId)
        }
      ]
    );
  };

  const deleteServico = async (servicoId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/servicos/${servicoId}`);
      Alert.alert('Sucesso', 'Serviço excluído com sucesso!');
      fetchServicos(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      Alert.alert('Erro', 'Não foi possível excluir o serviço');
    }
  };

  // Abrir modal para editar/criar
  const openEditModal = (servico = null) => {
    if (servico) {
      setEditingServico(servico);
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao || '',
        preco: servico.preco.toString(),
        duracao: servico.duracao.toString()
      });
    } else {
      setEditingServico(null);
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        duracao: ''
      });
    }
    setModalVisible(true);
  };

  // Salvar serviço (criar ou atualizar)
  const handleSave = async () => {
    if (!formData.nome || !formData.preco || !formData.duracao) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const servicoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        duracao: parseInt(formData.duracao)
      };

      if (editingServico) {
        // Atualizar
        await axios.put(`${API_BASE_URL}/api/servicos/${editingServico.id}`, servicoData);
        Alert.alert('Sucesso', 'Serviço atualizado com sucesso!');
      } else {
        // Criar
        await axios.post(`${API_BASE_URL}/api/servicos`, servicoData);
        Alert.alert('Sucesso', 'Serviço criado com sucesso!');
      }

      setModalVisible(false);
      fetchServicos(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      Alert.alert('Erro', 'Não foi possível salvar o serviço');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.nomeServico}>{item.nome}</Text>
        <Text style={styles.detalheServico}>Duração: {item.duracao} min</Text>
        <Text style={styles.detalheServico}>Preço: R$ {item.preco.toFixed(2)}</Text>
        {item.descricao && (
          <Text style={styles.descricaoServico}>{item.descricao}</Text>
        )}
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
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Administração - Serviços</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => openEditModal()}
        >
          <Text style={styles.addButtonText}>+ Novo Serviço</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={servicos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum serviço cadastrado</Text>
          </View>
        }
      />

      {/* Modal para Editar/Criar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do serviço *"
              value={formData.nome}
              onChangeText={(text) => setFormData({...formData, nome: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={formData.descricao}
              onChangeText={(text) => setFormData({...formData, descricao: text})}
              multiline
            />
            
            <TextInput
              style={styles.input}
              placeholder="Preço *"
              value={formData.preco}
              onChangeText={(text) => setFormData({...formData, preco: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Duração (minutos) *"
              value={formData.duracao}
              onChangeText={(text) => setFormData({...formData, duracao: text})}
              keyboardType="numeric"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ead6'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#B8860B'
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#36332C'
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardContent: {
    marginBottom: 10
  },
  nomeServico: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  detalheServico: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  descricaoServico: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 60
  },
  editButton: {
    backgroundColor: '#007AFF'
  },
  deleteButton: {
    backgroundColor: '#dc3545'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 16
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#6c757d'
  },
  saveButton: {
    backgroundColor: '#007AFF'
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default TelaAdm;