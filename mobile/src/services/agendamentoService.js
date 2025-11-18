// services/agendamentoService.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const agendamentoService = {
  // Verificar se um horário está disponível
  async verificarHorarioDisponivel(barbeiroId, data, horario) {
    try {
      // VALIDAÇÃO ADICIONADA
      if (!barbeiroId || !data || !horario) {
        throw new Error('Dados incompletos para verificação de horário');
      }

      const agendamentosRef = collection(db, 'agendamentos');
      const q = query(
        agendamentosRef,
        where('barbeiroId', '==', barbeiroId),
        where('data', '==', data),
        where('horario', '==', horario),
        where('status', 'in', ['agendado', 'confirmado'])
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // Retorna true se estiver disponível
    } catch (error) {
      console.error('Erro ao verificar horário:', error);
      return false;
    }
  },

  // Buscar todos os horários indisponíveis de um barbeiro em uma data específica
  async getHorariosIndisponiveis(barbeiroId, data) {
    try {
      // VALIDAÇÃO ADICIONADA
      if (!barbeiroId || !data) {
        console.error('Barbeiro ID ou data não fornecidos');
        return [];
      }

      const agendamentosRef = collection(db, 'agendamentos');
      const q = query(
        agendamentosRef,
        where('barbeiroId', '==', barbeiroId),
        where('data', '==', data),
        where('status', 'in', ['agendado', 'confirmado'])
      );

      const querySnapshot = await getDocs(q);
      const horariosIndisponiveis = [];
      
      querySnapshot.forEach((doc) => {
        horariosIndisponiveis.push(doc.data().horario);
      });

      return horariosIndisponiveis;
    } catch (error) {
      console.error('Erro ao buscar horários indisponíveis:', error);
      return [];
    }
  },

  // Criar novo agendamento
  async criarAgendamento(agendamentoData) {
    try {
      // VALIDAÇÃO ADICIONADA
      if (!agendamentoData?.barbeiro?.id || !agendamentoData.data || !agendamentoData.horario) {
        throw new Error('Dados de agendamento incompletos');
      }

      const barbeiroId = agendamentoData.barbeiro.id;
      const { data, horario } = agendamentoData;

      // VERIFICAÇÃO DUPLA DE DISPONIBILIDADE
      const disponivel = await this.verificarHorarioDisponivel(barbeiroId, data, horario);
      
      if (!disponivel) {
        throw new Error('Horário indisponível. Por favor, escolha outro horário.');
      }

      const agendamentosRef = collection(db, 'agendamentos');
      
      // DADOS DO AGENDAMENTO MELHORADOS
      const novoAgendamento = {
        ...agendamentoData,
        barbeiroId: barbeiroId,
        barbeiroNome: agendamentoData.barbeiro.nome, // ADICIONEI - backup do nome
        status: 'agendado',
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      };

      // REMOVI campos desnecessários do objeto barbeiro se existirem
      delete novoAgendamento.barbeiro; // ADICIONEI - evita dados duplicados

      const docRef = await addDoc(agendamentosRef, novoAgendamento);
      
      // RETORNO MELHORADO
      return { 
        id: docRef.id, 
        ...novoAgendamento,
        sucesso: true,
        mensagem: 'Agendamento realizado com sucesso!'
      };
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  // Buscar agendamentos por barbeiro e data
  async getAgendamentosPorBarbeiroEData(barbeiroId, data) {
    try {
      const agendamentosRef = collection(db, 'agendamentos');
      const q = query(
        agendamentosRef,
        where('barbeiroId', '==', barbeiroId),
        where('data', '==', data)
      );

      const querySnapshot = await getDocs(q);
      const agendamentos = [];
      
      querySnapshot.forEach((doc) => {
        agendamentos.push({ id: doc.id, ...doc.data() });
      });

      return agendamentos;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return [];
    }
  },

  // Buscar todos os agendamentos (para admin)
  async getAllAgendamentos() {
    try {
      const agendamentosRef = collection(db, 'agendamentos');
      const querySnapshot = await getDocs(agendamentosRef);
      const agendamentos = [];
      
      querySnapshot.forEach((doc) => {
        agendamentos.push({ id: doc.id, ...doc.data() });
      });

      return agendamentos;
    } catch (error) {
      console.error('Erro ao buscar todos os agendamentos:', error);
      return [];
    }
  }
};