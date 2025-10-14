const db = require('./database');

// Inserir dados iniciais
const inserirDadosIniciais = () => {
  // Serviços
  const servicos = [
    ['Sombracelha', 15.00, 10, 'pinca', 1],
    ['Reflexo', 25.00, 60, 'Pintura', 1],
    ['Corte Maquina', 25.00, 20, 'maquina', 1]
  ];

  servicos.forEach(servico => {
    db.run(`INSERT INTO servicos (nome, preco, duracao, descricao, ativo) VALUES (?, ?, ?, ?, ?)`, servico);
  });

  // Barbeiros
  const barbeiros = [
    ['João Silva', 'https://example.com/joao.jpg', 'Corte Social,Barba', 1, '09:00', '18:00', '08:00', '16:00', null, null],
    ['Pedro Santos', 'https://example.com/pedro.jpg', 'Degradê,Navalhado', 1, '10:00', '19:00', '09:00', '17:00', null, null]
  ];

  barbeiros.forEach(barbeiro => {
    db.run(`
      INSERT INTO barbeiros 
      (nome, foto, especialidades, ativo, seg_a_sexta_inicio, seg_a_sexta_fim, sabado_inicio, sabado_fim, domingo_inicio, domingo_fim) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, barbeiro);
  });

  console.log('Dados iniciais inseridos!');
};

// Executar após conexão com banco
setTimeout(inserirDadosIniciais, 1000);