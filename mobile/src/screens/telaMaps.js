import { View, StyleSheet, TouchableOpacity, Text, Platform, Alert, Linking } from "react-native";
import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // <-- IMPORT CORRETO

const cordenates = {
  latitude: -22.678516784947625,
  longitude: -43.275092275558144,
};

export default function TelaMaps() {

  const handleMarkerPress = async () => {
    console.log("Marcador pressionado!");

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });

    const latLng = `${cordenates.latitude},${cordenates.longitude}`;
    const label = 'SharpCut';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (!url) {
      return Alert.alert('Não foi possível abrir o Mapas');
    }

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert('Não foi possível abrir o Mapas');
    }
  }

  // Adicione isso temporariamente para testar
console.log('API Key:', 'AIzaSyBZnZJii7NAyHme882Ja_8AWkDKBt7JyJk');
console.log('Provider:', PROVIDER_GOOGLE);

  return (
    
    <View style={styles.container}>
  
      <MapView
        provider={PROVIDER_GOOGLE}   // <-- AQUI! NECESSÁRIO
        style={styles.map}
        initialRegion={{
          latitude: cordenates.latitude,
          longitude: cordenates.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
      >
        <Marker
          coordinate={cordenates}
          title={"SharpCut"}
          description={"Localização da barbearia"}
          pinColor="brown"
        />
      </MapView>

      <TouchableOpacity
        style={styles.button}
        onPress={handleMarkerPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
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
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    width: '90%',
    height: 60,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
