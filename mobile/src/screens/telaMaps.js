import { View ,StyleSheet} from "react-native";
import React from "react";
// Importe o componente Marker
import Map, { Marker } from 'react-native-maps' 

const cordenates = {
  latitude: -22.678516784947625, 
  longitude:-43.275092275558144,
}

export default function TelaMaps() {
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
          title={"appBarbearia"} // Título que aparece ao clicar
          description={"Localização da appBarbearia"} // Descrição opcional
          pinColor="blue" // Define a cor do pino. Você pode usar "red", "green", "blue", etc.
        />
      </Map>
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