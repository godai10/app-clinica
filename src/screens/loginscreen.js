import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro]   = useState('');

  function handleLogin() {
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setErro('');
    // Substituir por autenticação real com Supabase:
    // const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    navigation.replace('Main');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Logo / título */}
        <Text style={styles.logo}>🌸</Text>
        <Text style={styles.title}>MenteCuidada</Text>
        <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

        {/* Campos */}
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
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Erro */}
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        {/* Botão */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A3F8F',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d2660',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputArea: {
    width: '100%',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#4A3F8F',
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    width: '100%',
    color: '#111827',
  },
  erro: {
    fontSize: 12,
    color: '#A32D2D',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A3F8F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  forgotPass: {
    marginTop: 14,
  },
  forgotPassText: {
    color: '#6b7280',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
