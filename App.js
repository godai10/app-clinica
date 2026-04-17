import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bom dia,</Text>
        <Text style={styles.name}>Ana 👋</Text>
      </View>

      {/* CONTEÚDO */}
      <ScrollView style={styles.content}>

        {/* ALERTA */}
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            Resultado do hemograma disponível.
          </Text>
        </View>

        {/* AÇÕES RÁPIDAS */}
        <Text style={styles.section}>Ações rápidas</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard}>
            <Text>📅</Text>
            <Text>Agendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text>📋</Text>
            <Text>Consultas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text>🧪</Text>
            <Text>Exames</Text>
          </TouchableOpacity>
        </View>

        {/* CONSULTAS */}
        <Text style={styles.section}>Consultas recentes</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Dr. Carlos Mendes</Text>
          <Text style={styles.subtitle}>Cardiologia · 10 Abr</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Dra. Rita Braga</Text>
          <Text style={styles.subtitle}>Clínica Geral · 18 Abr</Text>
        </View>

      </ScrollView>

      {/* NAVBAR */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => setActiveTab("home")}>
          <Text style={activeTab === "home" ? styles.active : styles.inactive}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("agenda")}>
          <Text style={activeTab === "agenda" ? styles.active : styles.inactive}>📅</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("perfil")}>
          <Text style={activeTab === "perfil" ? styles.active : styles.inactive}>👤</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  header: {
    backgroundColor: "#1A5C8A",
    padding: 20,
  },

  greeting: {
    color: "#fff",
    fontSize: 12,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    padding: 16,
  },

  alert: {
    backgroundColor: "#FAEEDA",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },

  alertText: {
    fontSize: 12,
  },

  section: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  actionCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "30%",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
  },

  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
  },

  active: {
    color: "#1A5C8A",
    fontSize: 20,
  },

  inactive: {
    color: "gray",
    fontSize: 20,
  },
});