import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

// Comentário temporário: todos os imports podem ficar organizados aqui //
import LoginScreen from "./src/screens/loginscreen";
import HomeScreen from "./src/screens/homescreen";


// Comentário temporário: todos os componentes exportados podem ficar organizados aqui //
// Componente principal que exporta os Apps
export default function App() {
  const [isLogged, setIsLogged] = useState(false);

  if (!isLogged) {
    return <LoginScreen onLogin={() => setIsLogged(true)} />;
  }
  
  return <HomeScreen />;
}