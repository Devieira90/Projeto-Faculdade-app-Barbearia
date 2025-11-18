import React from 'react';
import { View, Text, StyleSheet ,Button,TouchableOpacity} from 'react-native';
import { styles } from './styles';

const Footer =({onPress})=> {

    return (


<View style={styles.footer}>
         
        

         <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>Proxima</Text>
            </TouchableOpacity>   


              
        </View>

    )    

}
export default Footer;
