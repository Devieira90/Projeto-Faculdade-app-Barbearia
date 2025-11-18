import { StyleSheet } from 'react-native';

 export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5e8c6ff' },
  titulo: { fontSize: 18, fontWeight: 'bold', padding: 15, color: '#333' }, // Reduzido para caber o nome do serviço
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 25,
    marginVertical: 8,
    backgroundColor: '#7c672eff',
    borderRadius: 8,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    borderWidth: 4,
    borderColor: '#251702ff',
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  barberImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular
    marginRight: 15,
    backgroundColor: '#ccc'
  },
  infoContainer: {
    flex: 1,
  },
  nomeBarbeiro: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fffafaff',
  },
  especialidade: {
    fontSize: 20,
    color: '#e7e3e3ff',
    marginTop: 4,
  },
  checkIcon: {
    fontSize: 24,
    color: '#007AFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },

});