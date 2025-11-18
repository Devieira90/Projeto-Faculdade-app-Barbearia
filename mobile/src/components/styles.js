
import { StyleSheet } from 'react-native';

 export const Styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#7fbcbeff',
    borderTopWidth: 1,
    borderTopColor: '#7fbcbeff',
    alignItems:"center"
  },

  button:{
    paddingBottom: 4,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor:'blue',
    color :'red',
    alignItems:"center",
    justifyContent:"center",
    width:"50%",
    height:60,
    hadowOffset: {
      width: 7,
      height: 7, // Deslocamento vertical da sombra (4 pixels para baixo)
    },
    shadowOpacity: 0, // Opacidade da sombra (0 a 1)
    shadowRadius: 4.65, // Raio do desfoque da sombra

    // Para Android (Elevation)
    elevation: 8, // Nível de elevação da sombra (número inteiro)
    
  },

  buttonText:{
    color:"#dd0",
    fontSize:25,
    justifyContent:"center",
    boxShadow:"4px",
    fontWeight:"bold"

  },

  btnTelaAdm:{
    paddingBottom: 4,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor:'#7fbcbeff',
    color :'red',
    alignItems:"center",
    justifyContent:"center",
    width:60,
    height:60,
  }

})
