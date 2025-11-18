import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ece0b6ff' 
  },
  header: {
    backgroundColor:  '#d4b35fff',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  currentMonth: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  weekContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayButton: {
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor:  '#ece0b6ff' ,
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#5fd114ff',
  },
  dayButtonSelected: {
    backgroundColor:   '#B8860B',
    borderColor: '#2196F3',
  },
  todayButton: {
    borderColor: '#FF9800',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  dayTextSelected: {
    color: 'white',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dayNumberSelected: {
    color: 'white',
  },
  todayNumber: {
    color: '#FF9800',
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF9800',
    marginTop: 4,
  },
  selectedDate: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  timeRange: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#ece0b6ff',
    borderWidth: 1,
    borderColor: '#5fd114ff',
  },
  timeButtonSelected: {
    backgroundColor:  '#B8860B',
    borderColor: '#4CAF50',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeTextSelected: {
    color: 'white',
  },
  confirmButton: {
    backgroundColor:  '#B8860B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },

    timeButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  timeTextDisabled: {
    color: '#999',
  },
  indisponivelText: {
    fontSize: 10,
    color: '#ff4444',
    marginTop: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 8,
  },
  // Adicione estas styles ao seu arquivo de estilos
monthText: {
  fontSize: 11,
  color: '#666',
  marginTop: 2,
},
monthTextSelected: {
  color: '#fff',
},

});