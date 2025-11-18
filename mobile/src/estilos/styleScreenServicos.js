import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ece0b6ff' 
  },
  
    gradient: {
    borderRadius: 2,
   // opcional
    
    width: '107%',
    height: '100%',
  },

  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    padding: 20, 
    color: '#3d1502ff',
    textAlign: 'center'
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    marginHorizontal: 25,
    marginVertical: 8,
    backgroundColor: '#B8860B',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#130f0fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 4,
    borderColor: '#8a6533ff',
    
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
  
  },
  nomeServico: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a2902ff',
  },
  detalheServico: {
    fontSize: 14,
    color:'#fffcf6ff',
    marginTop: 4,
    fontWeight: 'bold',
  },
  descricaoServico: {
    fontSize: 14,
    color: '#ffffffff',
    marginTop: 2,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  precoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 30,
  },
  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f3eeebff',
    alignItems: 'left',
    marginRight: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'left',
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
