import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, SafeAreaView, Button, ActivityIndicator, 
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'; // Necessário para formatação de datas (instale: npm install moment)
import Footer from '../components/footer';

// Importe a função mock de API
 //import { fetchHorariosDisponiveis } from './api'; 

// REPLICANDO A FUNÇÃO AQUI PARA SER UM ARQUIVO ÚNICO
const fetchHorariosDisponiveis = (barbeiroId, data, duracaoServico) => {
    console.log(`Buscando horários para Barbeiro ${barbeiroId} na data ${data} (Duração: ${duracaoServico} min)`);
    return new Promise((resolve) => {
        setTimeout(() => {
            let horarios = [];
            const isWeekend = new Date(data + 'T00:00:00').getDay() === 0 || new Date(data + 'T00:00:00').getDay() === 6; // Adicionado 'T00:00:00' para evitar problemas de timezone

            if (isWeekend) {
                horarios = ["09:00", "10:10", "11:20", "14:00", "15:10", "16:20"];
            } else {
                horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
            }

            if (barbeiroId !== '0') {
                horarios = horarios.filter((_, index) => index % 2 === 0);
            }

            resolve(horarios);
        }, 800);
    });
};


const TelaSelecaoDataHora = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { servico, barbeiro } = route.params;
  console.log('Serviço recebido:', route.params);

  // Estados
  const [dataSelecionada, setDataSelecionada] = useState(moment().format('YYYY-MM-DD'));
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Efeito para carregar horários sempre que a data mudar
  useEffect(() => {
    carregarHorarios(dataSelecionada);
  }, [dataSelecionada]); // Dependência: dataSelecionada

  // Função de requisição à API
  const carregarHorarios = useCallback(async (data) => {
    setHorariosDisponiveis([]); // Limpa horários anteriores
    setHorarioSelecionado(null); // Limpa seleção de horário
    setIsLoading(true);
    setErro(null);

    const dataFormatada = moment(data).format('YYYY-MM-DD');

    try {
      const horarios = await fetchHorariosDisponiveis(
        barbeiro.id, 
        dataFormatada, 
        servico.duracao
      );
      
      setHorariosDisponiveis(horarios);
    } catch (e) {
      console.error("Erro ao buscar horários:", e);
      setErro("Não foi possível carregar os horários. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [barbeiro.id, servico.duracao]);


  // Handlers
  const onDateChange = (date) => {
    // moment().subtract(1, 'day') para não permitir datas passadas
    setDataSelecionada(moment(date).format('YYYY-MM-DD'));
  };

  const handleSelectTime = (time) => {
    setHorarioSelecionado(time);
  };
  
  const goToFinalStep = () => {
    if (horarioSelecionado) {
      Alert.alert(
        "Confirmação",                                                                                                                                                                                                                                                      
        `Agendar ${servico.nome} com ${barbeiro.nome} em ${dataSelecionada} às ${horarioSelecionado}?`);
        navigation.popToTop();

    }
  };


  // Renderização
  const renderHorarioItem = ({ item }) => {
    const isSelected = item === horarioSelecionado;
    return (
      <TouchableOpacity
        style={[styles.timeCard, isSelected && styles.selectedTimeCard]}
        onPress={() => handleSelectTime(item)}
        disabled={isLoading}
      >
        <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Quando você quer agendar?</Text>
      <Text style={styles.subTitulo}>
        Serviço: **{servico.nome}** | Barbeiro: **{barbeiro.nome}**
      </Text>
      
      {/* Seletor de Data */}
      <View style={styles.calendarContainer}>
        <CalendarPicker
          onDateChange={onDateChange}
          minDate={moment()}
          todayBackgroundColor="#f0f0f0"
          selectedDayColor="#007AFF"
          selectedDayTextColor="#FFFFFF"
          textStyle={{ fontFamily: 'System' }} 
          monthTitleStyle={styles.monthTitle}
          yearTitleStyle={styles.yearTitle}
          nextComponent={<Text style={styles.navText} Próximo ></Text>}
          previousComponent={<Text style={styles.navText}>{"<"} Anterior</Text>}
          // Estilos de cabeçalho
          headerWrapperStyle={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginHorizontal: 15 }}
          dayLabelsWrapper={{ borderBottomWidth: 0, borderTopWidth: 0 }}
        />
      </View>
      
      <View style={styles.horariosHeader}>
        <Text style={styles.horariosTitle}>
          Horários disponíveis em {moment(dataSelecionada).format('DD/MM/YYYY')}
        </Text>
      </View>

      {/* Lista de Horários */}
      <View style={styles.horariosListContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : erro ? (
          <Text style={styles.errorText}>{erro}</Text>
        ) : horariosDisponiveis.length === 0 ? (
          <Text style={styles.noTimeText}>Nenhum horário disponível nesta data. 😔</Text>
        ) : (
          <FlatList
            data={horariosDisponiveis}
            renderItem={renderHorarioItem}
            keyExtractor={item => item}
            numColumns={4} // 4 colunas para exibir melhor
            columnWrapperStyle={styles.row}
          />
        )}
      </View>


      {/* Footer / Botão de Avançar */}
      {horarioSelecionado && (
    
        <Footer onPress={goToFinalStep} />
      )}
    </SafeAreaView>
  );
};

// ... Estilos

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', padding: 15, color: '#333' },
  subTitulo: { fontSize: 14, paddingHorizontal: 15, color: '#666', marginBottom: 10 },
  
  calendarContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  monthTitle: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  yearTitle: { fontSize: 16, color: '#666' },
  navText: { color: '#007AFF', fontWeight: 'bold' },

  horariosHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  horariosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  horariosListContainer: {
    flex: 1,
    padding: 15,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70, // Tamanho mínimo para 4 colunas
  },
  selectedTimeCard: {
    backgroundColor: '#007AFF',
    borderWidth: 1,
    borderColor: '#005AC5',
  },
  timeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
  },
  noTimeText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
 
});

export default TelaSelecaoDataHora;