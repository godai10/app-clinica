import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";

import { supabase } from "../services/supabase";

export default function PainelAdmin() {

  const [pacientes, setPacientes] = useState(0);
  const [estagiarios, setEstagiarios] = useState(0);
  const [agendamentos, setAgendamentos] = useState([]);
  const [totalAgendamentos, setTotalAgendamentos] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    const { count: qtdPacientes } = await supabase
      .from("pacientes")
      .select("*", { count: "exact", head: true });

    const { count: qtdEstagiarios } = await supabase
      .from("estagiarios")
      .select("*", { count: "exact", head: true });

const { data } = await supabase
  .from("agendamentos")
  .select(`
    *,
    pacientes (
      nome,
      telefone
    )
  `)
  .order("data_sessao", { ascending: true });

    setPacientes(qtdPacientes || 0);
    setEstagiarios(qtdEstagiarios || 0);
    setAgendamentos(data || []);
    setTotalAgendamentos(data?.length || 0);
  }

  async function alterarStatus(id, status) {

  const { error } = await supabase
    .from("agendamentos")
    .update({
      status
    })
    .eq("id", id);

  if (error) {
    Alert.alert("Erro", error.message);
    return;
  }

  carregarDados();
}

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>

      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20
        }}
      >
        Painel Administrativo
      </Text>

      <View
        style={{
          padding: 15,
          backgroundColor: "#E3F2FD",
          borderRadius: 10,
          marginBottom: 15
        }}
      >
        <Text>Total de Pacientes</Text>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold"
          }}
        >
          {pacientes}
        </Text>
      </View>

      <View
        style={{
          padding: 15,
          backgroundColor: "#E8F5E9",
          borderRadius: 10,
          marginBottom: 15
        }}
      >
        <Text>Total de Estagiários</Text>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold"
          }}
        >
          {estagiarios}
        </Text>
      </View>

      <View
        style={{
          padding: 15,
          backgroundColor: "#FFF8E1",
          borderRadius: 10,
          marginBottom: 20
        }}
      >
        <Text>Total de Agendamentos</Text>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold"
          }}
        >
          {totalAgendamentos}
        </Text>
      </View>

<Text
  style={{
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  }}
>
  Próximos Agendamentos
</Text>

{agendamentos.length === 0 && (
  <Text
    style={{
      color: "gray",
      marginBottom: 20
    }}
  >
    Nenhum agendamento encontrado.
  </Text>
)}

      <FlatList
        scrollEnabled={false}
        data={agendamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 10
            }}
          >
            <Text>
              Sessão: {item.tipo_sessao}
            </Text>

            <Text>
              Data: {item.data_sessao}
            </Text>

            <Text>
              Horário: {item.horario}
            </Text>

            <Text>
  Paciente: {item.pacientes?.nome}
</Text>

<Text>
  Telefone: {item.pacientes?.telefone}
</Text>
            <Text
  style={{
    fontWeight: "bold",
    marginTop: 5
  }}
>
  Status: {item.status}
</Text>

<View
  style={{
    flexDirection: "row",
    marginTop: 10,
    gap: 10
  }}
>

{item.status !== "realizada" && item.status !== "cancelada" && (

<TouchableOpacity
  onPress={() =>
    alterarStatus(
      item.id,
      "realizada"
    )
  }
    style={{
      backgroundColor: "#4CAF50",
      padding: 10,
      borderRadius: 8,
      flex: 1
    }}
  >
    <Text
      style={{
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      Confirmar
    </Text>
  </TouchableOpacity>)}

  {item.status !== "cancelada" && (

<TouchableOpacity
  onPress={() =>
    alterarStatus(
      item.id,
      "cancelada"
    )
    }
    style={{
      backgroundColor: "#F44336",
      padding: 10,
      borderRadius: 8,
      flex: 1
    }}
  >
    <Text
      style={{
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      Cancelar
    </Text>
  </TouchableOpacity>)}

  <TouchableOpacity
  style={{
    backgroundColor: "#25D366",
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  }}
>
  <Text
    style={{
      color: "white",
      textAlign: "center",
      fontWeight: "bold"
    }}
  >
    Contatar via WhatsApp
  </Text>
</TouchableOpacity>

</View>
          </View>
        )}
      />

    </ScrollView>
  );
}