import React from 'react';
import { TouchableOpacity, Text, StyleSheet ,View} from 'react-native';

import { useNavigation } from '@react-navigation/native';





const BtnScreenAmin = ({ title, onPress }) => {
  return (
    <View>
    <TouchableOpacity style={styles.btnTelaAdm} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>

    <View style={{flex:1,backgroundColor:'blue'}}>
        <Text>teste</Text>

    </View>
    

    </View>

    
    
  );
}

const styles = StyleSheet.create({
  btnTelaAdm:{
    paddingBottom: 4,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor:'#7fbcbeff',
    color :'red',
    alignItems:"center",
    justifyContent:"center",
    width:100,
    height:100,
    marginTop:20,
  },
  buttonText:{
    color:"#dd0",
    fontSize:20,
    justifyContent:"center",
    boxShadow:"4px",
    fontWeight:"bold"

  },
});         
export default BtnScreenAmin;