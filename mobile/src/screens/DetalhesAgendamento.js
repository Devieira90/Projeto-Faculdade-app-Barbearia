import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DetalhesAgendamento = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { agendamentoId } = route.params;

  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const docRef = doc(db, 'agendamentos', agendamentoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAgendamento({ id: docSnap.id, ...docSnap.data() });
        } else {
          Alert.alert('Erro', 'Agendamento não encontrado.');
          navigation.goBack();
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do agendamento:", error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do agendamento.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamento();
  }, [agendamentoId]);

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'agendamentos', agendamentoId));
              Alert.alert('Sucesso', 'Seu agendamento foi cancelado.');
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao cancelar agendamento:", error);
              Alert.alert('Erro', 'Não foi possível cancelar o agendamento.');
            }
          },
        },
      ]
    );
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (!agendamento) {
    return (
      <View style={styles.container}>
        <Text>Agendamento não encontrado.</Text>
      </View>
    );
  }

  const isPast = new Date(agendamento.data) < new Date();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{agendamento.servico?.nome}</Text>
          <Text style={styles.price}>R$ {agendamento.servico?.preco?.toFixed(2).replace('.', ',')}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color="#555" />
            <Text style={styles.infoText}>Barbeiro: {agendamento.barbeiro?.nome || agendamento.barbeiroNome || 'Não informado'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="event" size={20} color="#555" />
            <Text style={styles.infoText}>Data: {formatarData(agendamento.data)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="schedule" size={20} color="#555" />
            <Text style={styles.infoText}>Horário: {agendamento.horario || 'Não informado'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="info-outline" size={20} color="#555" />
            <Text style={styles.infoText}>Status: {isPast ? 'Realizado' : 'Agendado'}</Text>
          </View>
        </View>

        {!isPast && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Icon name="delete-forever" size={20} color="#fff" />
            <Text style={styles.cancelButtonText}>Cancelar Agendamento</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f5e8c6ff' },
  header: { padding: 20, backgroundColor: '#7c672eff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  price: { fontSize: 18, color: '#f5e8c6ff', marginTop: 5 },
  detailsContainer: { padding: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoText: { fontSize: 16, marginLeft: 10, color: '#333' },
  cancelButton: { flexDirection: 'row', backgroundColor: '#c0392b', padding: 15, borderRadius: 10, margin: 20, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  cancelButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default DetalhesAgendamento;
