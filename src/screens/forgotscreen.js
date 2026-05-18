import React, { use, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native'

export default function ForgotScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [enviado, setEnviando] = useState(false);

    // ================================
    // FUNÇÃO DE RECUPERAÇÃO (SUPABASE)
    // ================================
    async function handleSendResetLink() {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 1. Validação básica
        if (!email) {
            setErro('Por favor, digite seu e-mail.');
            return;
        }

        if (!emailValido.test(email)) {
            setErro('O formato do e-mail não é valido.');
            return;
        }

        setErro('');
        setCarregando(true); // Ativa um estado de espera

        try {
          // 2. Chamada ao Supabase
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'mente-cuidada://recuperar-senha', // Esquema para abrir o app pelo link
          });

          if (error) {
            setErro(error.message);
          } else {
            setEnviado(true); // Isso vai fazer o card "mudar" na tela
          }
          Alert.alert(
            "Sucesso!",
            "Se o e-mail estiver cadastrado, um link de recuperação será enviado.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (err) {
            setErro('Falha na conexão. Verifique sua internet.');
        } finally {
            setCarregando(false);
        }
    }

return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>🌸</Text>
        
        <Text style={styles.title}>Recuperar Senha</Text>
        
        <Text style={styles.subtitle}>
          Digite seu e-mail cadastrado para receber as instruções de recuperação.
        </Text>

        <View style={styles.inputArea}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="exemplo@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (erro) setErro('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        </View>

        <TouchableOpacity 
          style={[styles.button, carregando && { opacity: 0.7 }]} 
          onPress={handleSendResetLink}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>
            {carregando ? 'ENVIANDO...' : 'ENVIAR LINK'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar para o login</Text>
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
    backgroundColor: '#4A3F8F', // Cor padrão da clínica
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    // Sombras (Padrão que você usou no Login)
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    marginBottom: 10,
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
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#111827',
  },
  erro: {
    fontSize: 12,
    color: '#A32D2D',
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A3F8F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});    