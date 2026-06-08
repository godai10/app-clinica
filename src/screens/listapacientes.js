import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { supabase } from "../services/supabase";

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    buscarPacientes();
  }, []);

  async function buscarPacientes() {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setPacientes(data);
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>
        Lista de Pacientes
      </Text>

      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 15,
              padding: 10,
              borderWidth: 1,
              borderRadius: 8
            }}
          >
            <Text>Nome: {item.nome}</Text>
            <Text>Idade: {item.idade}</Text>
            <Text>Telefone: {item.telefone}</Text>
            <Text>Endereço: {item.endereco}</Text>
          </View>
        )}
      />
    </View>
  );
}