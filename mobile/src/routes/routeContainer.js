import { NavigationContainer } from "@react-navigation/native";
import AppRoute from "./stackRoute";




export default function RouteContainer({ children }) {  
    return <NavigationContainer>

        <AppRoute />
        
    
    
    </NavigationContainer>;
}