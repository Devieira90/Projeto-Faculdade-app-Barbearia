import react from "react";

import { View, Text } from "react-native";
import BtnScreenAmin from "../../components/btnScreenAmin"; 


export default function DashBoard(){
    return(
        <View>
            <Text>DashBoard</Text>
            <BtnScreenAmin title="Gerenciar barbeiros" onPress={() => {}} />
            <BtnScreenAmin title="Gerenciar serviços" onPress={() => {}} />
            <BtnScreenAmin title="Gerenciar agendamentos" onPress={() => {}} />
            <BtnScreenAmin title="Configurações" onPress={() => {}} />
        </View>
    )
}