// api.js (Simulação de chamada API)

/**
 * Simula a busca de horários disponíveis na API.
 * * @param {string} barbeiroId - ID do barbeiro ou '0' para qualquer.
 * @param {string} data - Data no formato YYYY-MM-DD.
 * @param {number} duracaoServico - Duração do serviço em minutos.
 * @returns {Promise<string[]>} Uma lista de horários disponíveis (ex: ["09:00", "10:30", ...]).
 */
export const fetchHorariosDisponiveis = (barbeiroId, data, duracaoServico) => {
  console.log(`Buscando horários para Barbeiro ${barbeiroId} na data ${data} (Duração: ${duracaoServico} min)`);
  
  // Geração de horários mockados. Na vida real, a API faria essa lógica
  // baseada em agendamentos existentes, horário de funcionamento e duração.
  return new Promise((resolve) => {
    setTimeout(() => {
      let horarios = [];
      const isWeekend = new Date(data).getDay() === 0 || new Date(data).getDay() === 6;

      if (isWeekend) {
         // Finais de semana costumam ter menos horários
        horarios = ["09:00", "10:10", "11:20", "14:00", "15:10", "16:20"];
      } else {
        // Dias de semana
        horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
      }
      
      // Filtra um pouco mais se for um barbeiro específico, para simular variação
      if (barbeiroId !== '0') {
          horarios = horarios.filter((_, index) => index % 2 === 0);
      }
      
      resolve(horarios);
    }, 800); // Simula um delay de rede de 0.8s
  });
};