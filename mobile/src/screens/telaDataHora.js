// telaSelecaoDataHora.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { agendamentoService } from '../services/agendamentoService';
import { auth, db } from '../config/firebaseConfig'; // Importar o auth e o db
import { doc, getDoc } from 'firebase/firestore'; // Importar getDoc
import { styles } from '../estilos/styleScreenDataHora';

const AgendamentoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { servico, barbeiro } = route.params;

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [horariosIndisponiveis, setHorariosIndisponiveis] = useState([]);
  const [verificandoDisponibilidade, setVerificandoDisponibilidade] = useState(false);

  // Dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Horários disponíveis (8:00 às 20:00)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // CORREÇÃO: Gerar de hoje até 7 dias no futuro
  const generateCurrentWeek = () => {
    const today = new Date();
    const week = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      
      const isToday = i === 0; // Primeiro dia é hoje
      
      week.push({
        date: day,
        dayOfMonth: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
        dayOfWeek: day.getDay(),
        isToday: isToday,
        dateString: formatDateForFirestore(day),
        // Novo: nome do mês abreviado
        monthName: months[day.getMonth()],
        // Novo: dia da semana por extenso
        dayName: weekDays[day.getDay()]
      });
    }
    
    setCurrentWeek(week);
    
    // Selecionar hoje automaticamente
    setSelectedDay(0);
    setSelectedDate(week[0]);
  };

  // Formatar data para o Firestore (YYYY-MM-DD)
  const formatDateForFirestore = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Buscar horários indisponíveis com melhor tratamento
  const fetchHorariosIndisponiveis = async (dataString) => {
    if (!barbeiro?.id) {
      console.error('Barbeiro ID não definido');
      return;
    }
    
    try {
      setVerificandoDisponibilidade(true);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao verificar disponibilidade')), 10000)
      );
      
      const disponibilidadePromise = agendamentoService.getHorariosIndisponiveis(
        barbeiro.id, 
        dataString
      );
      
      const indisponiveis = await Promise.race([disponibilidadePromise, timeoutPromise]);
      setHorariosIndisponiveis(indisponiveis || []);
      
    } catch (error) {
      console.error('Erro ao buscar horários indisponíveis:', error);
      
      if (error.message.includes('Timeout')) {
        Alert.alert('Erro', 'Tempo limite excedido ao verificar disponibilidade.');
      } else {
        Alert.alert('Erro', 'Não foi possível verificar a disponibilidade de horários.');
      }
      setHorariosIndisponiveis([]);
    } finally {
      setVerificandoDisponibilidade(false);
    }
  };

  useEffect(() => {
    generateCurrentWeek();
  }, []);

  useEffect(() => {
    if (selectedDate && barbeiro?.id) {
      fetchHorariosIndisponiveis(selectedDate.dateString);
    }
  }, [selectedDate, barbeiro]);

  // Validação para evitar agendamentos no passado
  const handleDaySelect = async (dayIndex, dayData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDateObj = new Date(dayData.date);
    selectedDateObj.setHours(0, 0, 0, 0);

    // Verificar se a data é no passado (não deveria acontecer com o novo range)
    if (selectedDateObj < today) {
      Alert.alert(
        'Data Inválida',
        'Não é possível agendar para datas passadas.'
      );
      return;
    }

    setSelectedDay(dayIndex);
    setSelectedDate(dayData);
    setSelectedTime(null);
    
    // Feedback visual imediato ao selecionar data
    if (horariosIndisponiveis.length > 0) {
      setHorariosIndisponiveis([]);
    }
  };

  const handleTimeSelect = (time) => {
    if (horariosIndisponiveis.includes(time)) {
      Alert.alert('Horário Indisponível', 'Este horário já está agendado. Por favor, escolha outro.');
      return;
    }
    
    // Verificar se não é um horário no passado
    if (isTimeInPast(time)) {
      Alert.alert('Horário Inválido', 'Não é possível agendar para horários no passado.');
      return;
    }
    
    setSelectedTime(time);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Atenção', 'Por favor, selecione um dia e um horário.');
      return;
    }

    // Verificar se não é um horário no passado
    const selectedDateTime = new Date(`${selectedDate.dateString}T${selectedTime}`);
    if (selectedDateTime < new Date()) {
      Alert.alert('Horário Inválido', 'Não é possível agendar para horários no passado.');
      return;
    }

    console.log('DEBUG - Serviço:', servico);
    console.log('DEBUG - Barbeiro:', barbeiro);
    console.log('DEBUG - Barbeiro ID:', barbeiro?.id);
    console.log('DEBUG - Data:', selectedDate.dateString);
    console.log('DEBUG - Horário:', selectedTime);

    if (!servico || !barbeiro) {
      Alert.alert('Erro', 'Dados do serviço ou barbeiro não encontrados.');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para fazer um agendamento.');
      setLoading(false);
      return;
    }

    setLoading(true);

    // Busca o nome do usuário no Firestore
    let nomeUsuario = currentUser.email; // Fallback para o email
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      nomeUsuario = userDocSnap.data().nome;
    }

    try {
      // Verificar disponibilidade novamente antes de confirmar
      const disponivel = await agendamentoService.verificarHorarioDisponivel(
        barbeiro.id,
        selectedDate.dateString,
        selectedTime
      );

      if (!disponivel) {
        Alert.alert('Horário Indisponível', 'Este horário foi reservado recentemente. Por favor, escolha outro.');
        setLoading(false);
        return;
      }

      // Criar objeto de agendamento
      const agendamentoData = {
        servico: {
          id: servico.id,
          nome: servico.nome,
          preco: servico.preco,
          duracao: servico.duracao
        },
        barbeiro: { // Garante que o objeto barbeiro seja salvo, não apenas o nome
          id: barbeiro.id,
          nome: barbeiro.nome,
          especialidade: barbeiro.especialidade
        }, 
        data: selectedDate.dateString,
        horario: selectedTime,
        dataCompleta: new Date(`${selectedDate.dateString}T${selectedTime}`),
        status: 'agendado',
        userId: currentUser.uid, // Adicionando o ID do usuário
        userName: nomeUsuario // Adicionando o nome do usuário
      };

      // Salvar no Firestore
      const agendamentoCriado = await agendamentoService.criarAgendamento(agendamentoData);

      Alert.alert(
        'Agendamento Confirmado!',
        `Seu horário foi agendado com sucesso:\n
        Serviço: ${servico.nome}\n
        Barbeiro: ${barbeiro.nome}\n
        Data: ${formatDateDisplay(selectedDate)}\n
        Horário: ${selectedTime}\n
        Preço: R$ ${servico.preco.toFixed(2).replace('.', ',')}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PainelUsuario')
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      Alert.alert(
        'Erro no Agendamento',
        error.message === 'Horário indisponível' 
          ? 'Este horário não está mais disponível. Por favor, escolha outro.'
          : 'Não foi possível realizar o agendamento. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (dateData) => {
    if (!dateData) return '';
    return dateData.date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Nova função: formatar data para exibição amigável
  const formatDateFriendly = (dateData) => {
    if (!dateData) return '';
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (dateData.isToday) {
      return 'Hoje';
    } else if (dateData.date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return `${dateData.dayName}, ${dateData.dayOfMonth} ${dateData.monthName}`;
    }
  };

  const isTimeDisabled = (time) => {
    return horariosIndisponiveis.includes(time);
  };

  // Verificar se é um horário no passado
  const isTimeInPast = (time) => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate.dateString}T${time}`);
    
    return selectedDateTime < now;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agendar Horário</Text>
        <Text style={styles.subtitle}>
          Serviço: {servico?.nome} | Barbeiro: {barbeiro?.nome}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Seção dos dias da semana */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione a Data</Text>
          <Text style={styles.currentMonth}>
            Período: {formatDateDisplay(currentWeek[0])} a {formatDateDisplay(currentWeek[6])}
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.weekContainer}>
              {currentWeek.map((dayData, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    selectedDay === index && styles.dayButtonSelected,
                    dayData.isToday && styles.todayButton
                  ]}
                  onPress={() => handleDaySelect(index, dayData)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDay === index && styles.dayTextSelected
                  ]}>
                    {formatDateFriendly(dayData)}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    selectedDay === index && styles.dayNumberSelected,
                    dayData.isToday && styles.todayNumber
                  ]}>
                    {dayData.dayOfMonth}
                  </Text>
                  <Text style={[
                    styles.monthText,
                    selectedDay === index && styles.monthTextSelected
                  ]}>
                    {dayData.monthName}
                  </Text>
                  {dayData.isToday && (
                    <View style={styles.todayIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {selectedDate && (
            <Text style={styles.selectedDate}>
              Data selecionada: {formatDateDisplay(selectedDate)} - {selectedDate.dayName}
            </Text>
          )}
        </View>

        {/* Seção dos horários */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
          <Text style={styles.timeRange}>8:00 às 20:00</Text>
          
          {verificandoDisponibilidade && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Verificando disponibilidade...</Text>
            </View>
          )}

          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => {
              const isDisabled = isTimeDisabled(time);
              const isSelected = selectedTime === time;
              const isPast = isTimeInPast(time);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeButton,
                    isSelected && styles.timeButtonSelected,
                    (isDisabled || isPast) && styles.timeButtonDisabled
                  ]}
                  onPress={() => !isDisabled && !isPast && handleTimeSelect(time)}
                  disabled={isDisabled || isPast}
                >
                  <Text style={[
                    styles.timeText,
                    isSelected && styles.timeTextSelected,
                    (isDisabled || isPast) && styles.timeTextDisabled
                  ]}>
                    {time}
                  </Text>
                  {isDisabled && (
                    <Text style={styles.indisponivelText}>Indisponível</Text>
                  )}
                  {isPast && !isDisabled && (
                    <Text style={styles.indisponivelText}>Passado</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Botão de confirmação */}
        <TouchableOpacity 
          style={[
            styles.confirmButton, 
            loading && styles.confirmButtonDisabled
          ]} 
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
          )}
        </TouchableOpacity>

        {/* Informações do agendamento */}
        {(selectedDate || selectedTime) && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumo do Agendamento:</Text>
            <Text style={styles.summaryText}>Serviço: {servico?.nome}</Text>
            <Text style={styles.summaryText}>Barbeiro: {barbeiro?.nome}</Text>
            {selectedDate && (
              <Text style={styles.summaryText}>
                Data: {formatDateDisplay(selectedDate)} - {selectedDate.dayName}
              </Text>
            )}
            {selectedTime && (
              <Text style={styles.summaryText}>Horário: {selectedTime}</Text>
            )}
            <Text style={styles.summaryPrice}>
              Total: R$ {servico?.preco?.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgendamentoScreen;