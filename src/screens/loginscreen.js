import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    // KeyboardAvoidingView evita que o teclado cubra o card em telas menores
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login no Sistema</Text>
        <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

        <View style={styles.inputArea}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            placeholder="exemplo@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="********"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPass}>
          <Text style={styles.forgotPassText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", // Centraliza o card horizontalmente
    backgroundColor: "#1A5C8A" // Fundo azul escuro (mesmo do seu header)
  },
  card: {
    width: '85%', // O card ocupa 85% da largura da tela
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    // Sombra para Android
    elevation: 10,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#333", 
    textAlign: "center",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25
  },
  inputArea: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    color: "#1A5C8A",
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: 2
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    fontSize: 16
  },
  button: {
    backgroundColor: "#1A5C8A",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#1A5C8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16,
    letterSpacing: 1
  },
  forgotPass: {
    marginTop: 15,
    alignItems: "center"
  },
  forgotPassText: {
    color: "#666",
    fontSize: 13,
    textDecorationLine: 'underline'
  }
});