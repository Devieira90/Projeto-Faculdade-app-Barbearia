import { View ,StyleSheet,TouchableOpacity,Text,Platform,Alert,Linking} from "react-native";
import React from "react";
// Importe o componente Marker
import Map, { Marker,Callout } from 'react-native-maps' 

const cordenates = {
  latitude: -22.678516784947625, 
  longitude:-43.275092275558144,
}

export default function TelaMaps(){

     const handleMarkerPress= async () => {
    // Lógica para quando o marcador for pressionado
    console.log("Marcador pressionado!");

   
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=' 
    })
    const latLng = `${cordenates.latitude},${cordenates.longitude}`;
    const label = 'Charpcut ';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if(!url){
      return Alert.alert('Nao foi possivel abrir o Mapas');

    }

    const canOpen =  await Linking.canOpenURL(url);

    if(canOpen){
      Linking.openURL(url);
    }else{
      Alert.alert('Nao foi possivel abrir o Mapas');
    }
  }
  

  return (
    <View style={styles.container}>
      <Map 
        style={styles.map}
        initialRegion={{
          latitude: cordenates.latitude,
          longitude:cordenates.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
      >
        {/* Adiciona o componente Marker dentro do Map */}
        <Marker 
          coordinate={cordenates} // Posição do marcador
          title={"SharpCut"} // Título que aparece ao clicar
          description={"Localização da appBarbearia"} // Descrição opcional
          pinColor="brown" // Define a cor do pino. Você pode usar "red", "green", "blue", etc.
        />
      </Map>

      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 850,
          left: 20,
          backgroundColor: 'black',
          padding: 10,
          borderRadius: 8,
          elevation: 5,
          width:'90%',
          height:60,
          
        }}
        onPress={() => {
          // Ação ao pressionar o botão (ex: navegar para outra tela)
          handleMarkerPress();
        }}
        activeOpacity={0.7}
      >
        <Text style={{ color: 'white', fontSize: 20,textAlign: 'center', marginTop:4,fontWeight:'bold'}}>
          Como Chegar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});