import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3caff', // Fundo dourado claro (bege)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#D4AF37', // Dourado como cor principal do header
    borderBottomWidth: 1,
    borderBottomColor: '#C09E2B', // Tom de dourado mais escuro para a borda
  },
  headerLeft: {
    flexDirection: 'column',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#121212', // Texto escuro para contraste
  },
  nomeUsuario: {
    fontSize: 16,
    color: '#333333', // Texto escuro para contraste
  },
  logoutButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333', // Texto escuro
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  semAgendamento: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
    textAlign: 'center',
  },
  botaoAgendar: {
    marginTop: 20,
    backgroundColor: '#D4AF37', // Dourado
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  textAgendar: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF', // Fundo branco para os cards
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  firstCard: {
    marginTop: 0,
  },
  lastCard: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE', // Borda clara
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Texto escuro
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#121212',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTexto: {
    fontSize: 14,
    color: '#555555', // Texto cinza médio
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#D4AF37', // Fundo branco para o rodapé
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  botaoHome: {
    backgroundColor: '#525252ff', // Dourado
  },
  botaoLocal: {
    backgroundColor: '#525252ff',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  // --- Estilos do Modal ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFFFF', // Fundo branco para o modal
    borderRadius: 20,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333', // Texto escuro
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#444444', // Texto escuro
    flexShrink: 1, // Permite que o texto quebre a linha se for muito longo
  },
  modalButton: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#6c757d', // Cinza
  },
  cancelButton: {
    backgroundColor: '#d9534f', // Vermelho (mantido para ações de perigo)
  },
});