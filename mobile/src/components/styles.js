
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
    backgroundColor:'#7c672eff',
    alignItems:"center",
    justifyContent:"center",
    width:"50%",
    height:60,
    shadowOffset: {
      width: 7,
      height: 7,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,

    elevation: 8, // Nível de elevação da sombra (número inteiro)
    
  },

  buttonText:{
    color:"rgba(255, 255, 255, 1)",
    fontSize:25,
    justifyContent:"center",
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
