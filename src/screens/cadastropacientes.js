import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";

import { supabase } from "../services/supabase";

export default function CadastroPacientes() {

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

 async function cadastrarPaciente() {

  const { data: pacienteCriado, error: erroPaciente } = await supabase
    .from("pacientes")
    .insert([
      {
        nome,
        idade: parseInt(idade),
        telefone,
        endereco
      }
    ])
    .select()
    .single();

  if (erroPaciente) {
    Alert.alert("Erro", erroPaciente.message);
    return;
  }

  const { error: erroUsuario } = await supabase
    .from("usuarios")
    .insert([
      {
        nome,
        email,
        senha,
        tipo: "paciente",
        paciente_id: pacienteCriado.id
      }
    ]);

  if (erroUsuario) {
    Alert.alert("Erro", erroUsuario.message);
    return;
  }

  Alert.alert(
    "Sucesso",
    "Conta criada com sucesso!"
  );

  setNome("");
  setIdade("");
  setTelefone("");
  setEndereco("");
  setEmail("");
  setSenha("");
}

  return (
    <View style={{ padding: 20 }}>

      <Text style={{
        fontSize: 24,
        marginBottom: 20
      }}>
        Cadastro de Paciente
      </Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10
        }}
      />

      <TouchableOpacity
        onPress={cadastrarPaciente}
        style={{
          backgroundColor: "#4A3F8F",
          padding: 15,
          borderRadius: 8
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center"
          }}
        >
          Criar Conta
        </Text>
      </TouchableOpacity>

    </View>
  );
}