const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com SQLite:', err.message);
  } else {
    console.log('Conectado ao SQLite!');
    criarTabelas();
  }
});

function criarTabelas() {
  // Tabela de Serviços
  db.run(`CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    duracao INTEGER NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT 1
  )`);

  // Tabela de Barbeiros
  db.run(`CREATE TABLE IF NOT EXISTS barbeiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    foto TEXT,
    especialidades TEXT,
    ativo BOOLEAN DEFAULT 1,
    seg_a_sexta_inicio TEXT,
    seg_a_sexta_fim TEXT,
    sabado_inicio TEXT,
    sabado_fim TEXT,
    domingo_inicio TEXT,
    domingo_fim TEXT
  )`);

  // Tabela de Agendamentos
  db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_nome TEXT NOT NULL,
    cliente_telefone TEXT NOT NULL,
    servico_id INTEGER NOT NULL,
    barbeiro_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    horario TEXT NOT NULL,
    status TEXT DEFAULT 'agendado',
    duracao INTEGER,
    valor REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (servico_id) REFERENCES servicos (id),
    FOREIGN KEY (barbeiro_id) REFERENCES barbeiros (id)
  )`);
}

module.exports = db;