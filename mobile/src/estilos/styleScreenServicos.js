import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Estilos do Cabeçalho
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15, // Reduzido para aproximar o botão da borda
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#FDF5E6', // Cor de fundo do container
  },
  headerButton: {
    padding: 8, // Aumenta a área de toque
  },
  titulo: {
    fontSize: 22, // Levemente reduzido para caber melhor
    fontWeight: 'bold',
    color: '#333',
  },

  // Estilos do Conteúdo
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    marginBottom: 10,
  },
  errorDetail: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#121212',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent', // Borda transparente por padrão
  },
  cardSelected: {
    borderColor: '#D4AF37', // Borda dourada quando selecionado
    shadowColor: '#D4AF37',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  nomeServico: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detalheServico: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  descricaoServico: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  precoContainer: {
    alignItems: 'flex-end',
  },
  preco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});