import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

// import { supabase } from '../lib/supabase';

export default function ForgotScreen({ navigation }) {

  // ================================
  // STATES
  // ================================

  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  // email | sms
  const [modo, setModo] = useState('email');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // ================================
  // RECUPERAÇÃO DE SENHA
  // ================================

  async function handleSendResetLink() {

    setErro('');
    setCarregando(true);

    try {

      // =========================
      // RECUPERAÇÃO VIA EMAIL
      // =========================

      if (modo === 'email') {

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
          setErro('Digite seu e-mail.');
          return;
        }

        if (!emailValido.test(email)) {
          setErro('E-mail inválido.');
          return;
        }

        // =========================
        // SUPABASE RESET PASSWORD
        // =========================

        /*
        const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
            'mente-cuidada://recuperar-senha',
          }
        );

        if (error) {
          setErro(error.message);
          return;
        }
        */

        Alert.alert(
          'Sucesso',
          'O link de recuperação foi enviado por e-mail.'
        );
      }

      // =========================
      // RECUPERAÇÃO VIA SMS
      // =========================

      else {

        if (!telefone) {
          setErro('Digite seu telefone.');
          return;
        }

        // Remove tudo que não for número
        const telefoneFormatado =
          telefone.replace(/\D/g, '');

        // =========================
        // SUPABASE OTP SMS
        // =========================

        /*
        const { error } =
        await supabase.auth.signInWithOtp({
          phone: `+55${telefoneFormatado}`,
        });

        if (error) {
          setErro(error.message);
          return;
        }
        */

        Alert.alert(
          'Código enviado',
          'Você receberá um SMS com código de recuperação.'
        );
      }

    }
    catch (err) {

      setErro('Erro de conexão.');

    }
    finally {

      setCarregando(false);

    }
  }

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <View style={styles.card}>

        {/* Logo */}
        <Text style={styles.logo}>🌸</Text>

        {/* Título */}
        <Text style={styles.title}>
          Recuperar Senha
        </Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          Escolha como deseja recuperar sua senha.
        </Text>

        {/* ================================
            SELETOR EMAIL / SMS
        ================================= */}

        <View style={styles.switchContainer}>

          <TouchableOpacity
            style={[
              styles.switchButton,
              modo === 'email'
              && styles.switchButtonActive
            ]}
            onPress={() => setModo('email')}
          >

            <Text
              style={[
                styles.switchText,
                modo === 'email'
                && styles.switchTextActive
              ]}
            >
              E-mail
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchButton,
              modo === 'sms'
              && styles.switchButtonActive
            ]}
            onPress={() => setModo('sms')}
          >

            <Text
              style={[
                styles.switchText,
                modo === 'sms'
                && styles.switchTextActive
              ]}
            >
              SMS
            </Text>

          </TouchableOpacity>

        </View>

        {/* ================================
            INPUT DINÂMICO
        ================================= */}

        <View style={styles.inputArea}>

          {
            modo === 'email'
              ? (
                <>
                  <Text style={styles.label}>
                    E-mail
                  </Text>

                  <TextInput
                    style={styles.input}

                    placeholder="exemplo@email.com"

                    placeholderTextColor="#999"

                    value={email}

                    onChangeText={(text) => {
                      setEmail(text);

                      if (erro) {
                        setErro('');
                      }
                    }}

                    keyboardType="email-address"

                    autoCapitalize="none"
                  />
                </>
              )
              : (
                <>
                  <Text style={styles.label}>
                    Telefone
                  </Text>

                  <TextInput
                    style={styles.input}

                    placeholder="(11) 99999-9999"

                    placeholderTextColor="#999"

                    value={telefone}

                    onChangeText={(text) => {
                      setTelefone(text);

                      if (erro) {
                        setErro('');
                      }
                    }}

                    keyboardType="phone-pad"
                  />
                </>
              )
          }

          {/* ================================
              ERRO
          ================================= */}

          {
            erro
              ? <Text style={styles.erro}>{erro}</Text>
              : null
          }

        </View>

        {/* ================================
            BOTÃO
        ================================= */}

        <TouchableOpacity
          style={[
            styles.button,
            carregando && { opacity: 0.7 }
          ]}

          onPress={handleSendResetLink}

          disabled={carregando}
        >

          <Text style={styles.buttonText}>

            {
              carregando
                ? 'ENVIANDO...'
                : modo === 'email'
                  ? 'ENVIAR LINK'
                  : 'ENVIAR SMS'
            }

          </Text>

        </TouchableOpacity>

        {/* ================================
            VOLTAR
        ================================= */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >

          <Text style={styles.backButtonText}>
            Voltar para o login
          </Text>

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

    alignItems: 'center',

    elevation: 10,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 5
    },

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

  // ================================
  // SWITCH EMAIL / SMS
  // ================================

  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    width: '100%',
  },

  switchButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  switchButtonActive: {
    backgroundColor: '#4A3F8F',
  },

  switchText: {
    color: '#6b7280',
    fontWeight: '600',
  },

  switchTextActive: {
    color: '#fff',
  },

  // ================================
  // INPUTS
  // ================================

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

  // ================================
  // BOTÃO
  // ================================

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

  // ================================
  // VOLTAR
  // ================================

  backButton: {
    marginTop: 20,
  },

  backButtonText: {
    color: '#6b7280',
    fontSize: 13,
    textDecorationLine: 'underline',
  },

});