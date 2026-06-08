import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../services/supabase";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Switch,
  Alert,
} from "react-native";

// ─── Dados fictícios ──────────────────────────────────────────────────────────


// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Avatar({ initials, size = 72 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.33 }]}>{initials}</Text>
    </View>
  );
}

function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuBtn({ icon, label, sublabel, onPress, danger = false }) {
  return (
    <TouchableOpacity style={styles.menuBtn} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, danger && { color: "#A32D2D" }]}>{label}</Text>
        {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

// ─── Modal de edição ──────────────────────────────────────────────────────────

function EditarModal({ campo, valor, onSalvar, onFechar }) {
  const [texto, setTexto] = useState(valor);

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitulo}>Editar {campo}</Text>
          <TouchableOpacity onPress={onFechar}>
            <Text style={styles.fecharText}>✕</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.modalInput}
          value={texto}
          onChangeText={setTexto}
          autoFocus
          placeholderTextColor="#9ca3af"
        />
        <View style={styles.modalAcoes}>
          <TouchableOpacity style={styles.btnCancelar} onPress={onFechar}>
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSalvar} onPress={() => onSalvar(texto)}>
            <Text style={styles.btnSalvarText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Modal de trocar senha ────────────────────────────────────────────────────

function TrocarSenhaModal({ onFechar }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");

  function handleSalvar() {
    if (!senhaAtual || !novaSenha || !confirmar) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    // await supabase.auth.updateUser({ password: novaSenha })
    Alert.alert("Sucesso", "Senha alterada com sucesso!");
    onFechar();
  }

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitulo}>Trocar senha</Text>
          <TouchableOpacity onPress={onFechar}>
            <Text style={styles.fecharText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.senhaLabel}>Senha atual</Text>
        <TextInput
          style={styles.modalInput}
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.senhaLabel}>Nova senha</Text>
        <TextInput
          style={styles.modalInput}
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.senhaLabel}>Confirmar nova senha</Text>
        <TextInput
          style={styles.modalInput}
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
        />

        {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

        <View style={styles.modalAcoes}>
          <TouchableOpacity style={styles.btnCancelar} onPress={onFechar}>
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
            <Text style={styles.btnSalvarText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── PerfilScreen principal ───────────────────────────────────────────────────

export default function PerfilScreen({ navigation }) {
  const usuario = global.usuarioLogado;
  const [notifSessoes, setNotifSessoes] = useState(true);
  const [notifLembretes, setNotifLembretes] = useState(true);

  const [modalEditar, setModalEditar] = useState(null); // { campo, valor }
  const [modalSenha, setModalSenha] = useState(false);


  function handleEditar(campo, valor) {
    setModalEditar({ campo, valor });
  }

  

  function handleSalvar(novoValor) {
    const chave = modalEditar.campo === "Nome" ? "name"
      : modalEditar.campo === "Telefone" ? "telefone"
      : "email";
    setUsuario((prev) => ({ ...prev, [chave]: novoValor }));
    setModalEditar(null);
  }

  function handleLogout() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => navigation.replace("Login"),
          // onPress: async () => { await supabase.auth.signOut(); navigation.replace("Login"); }
        },
      ]
    );
  }

  if (!usuario) {
  return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header roxo com avatar */}
        <View style={styles.header}>
          <Avatar
  initials={
    usuario.nome
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
  }
/>
          <Text style={styles.headerNome}>{usuario.nome}</Text>
          <Text style={styles.headerEmail}>{usuario.email}</Text>
          <View style={styles.planoBadge}>
            <Text style={styles.planoText}>
  ⭐ Paciente
</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* ── Dados pessoais ── */}
          <SectionTitle title="Dados pessoais" />
          <View style={styles.card}>
            <InfoRow
  icon="👤"
  label="Nome completo"
  value={usuario.nome}
/>
            <View style={styles.divider} />
            <InfoRow icon="✉️"  label="E-mail"           value={usuario.email} />
            <View style={styles.divider} />
            <InfoRow
  icon="📱"
  label="Telefone"
  value="Não informado"
/>
            <View style={styles.divider} />
            <InfoRow
  icon="🎂"
  label="Data de nascimento"
  value="Não informado"
/>
          </View>

          {/* ── Editar informações ── */}
          <SectionTitle title="Editar informações" />
          <View style={styles.card}>
            <MenuBtn icon="✏️" label="Editar nome"     onPress={() => handleEditar("Nome", usuario.nome)} />
            <View style={styles.divider} />
            <MenuBtn icon="📱" label="Editar telefone" onPress={() => handleEditar("Telefone", usuario.telefone)} />
            <View style={styles.divider} />
            <MenuBtn icon="🔒" label="Trocar senha"    sublabel="Altere sua senha de acesso" onPress={() => setModalSenha(true)} />
          </View>

          {/* ── Notificações ── */}
          <SectionTitle title="Notificações" />
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <Text style={styles.switchIcon}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Lembretes de sessão</Text>
                <Text style={styles.switchSub}>Receba avisos antes de cada sessão</Text>
              </View>
              <Switch
                value={notifSessoes}
                onValueChange={setNotifSessoes}
                trackColor={{ false: "#e5e7eb", true: "#A78BFA" }}
                thumbColor={notifSessoes ? "#4A3F8F" : "#9ca3af"}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.switchRow}>
              <Text style={styles.switchIcon}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Novidades e lembretes</Text>
                <Text style={styles.switchSub}>Dicas e atualizações do app</Text>
              </View>
              <Switch
                value={notifLembretes}
                onValueChange={setNotifLembretes}
                trackColor={{ false: "#e5e7eb", true: "#A78BFA" }}
                thumbColor={notifLembretes ? "#4A3F8F" : "#9ca3af"}
              />
            </View>
          </View>

          {/* ── Conta ── */}
          <SectionTitle title="Conta" />
          <View style={styles.card}>
            <MenuBtn
              icon="🚪"
              label="Sair da conta"
              sublabel="Você precisará fazer login novamente"
              onPress={handleLogout}
              danger
            />
          </View>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>

      {/* Modal editar campo */}
      {modalEditar && (
        <EditarModal
          campo={modalEditar.campo}
          valor={modalEditar.valor}
          onSalvar={handleSalvar}
          onFechar={() => setModalEditar(null)}
        />
      )}

      {/* Modal trocar senha */}
      {modalSenha && (
        <TrocarSenhaModal onFechar={() => setModalSenha(false)} />
      )}
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  // Header
  header: {
    backgroundColor: "#4A3F8F",
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 28,
    gap: 6,
  },
  avatar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  headerNome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
  },
  planoBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  planoText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "500",
  },

  // Body
  body: {
    padding: 16,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 2,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  divider: {
    height: 0.5,
    backgroundColor: "#e5e7eb",
    marginLeft: 16,
  },

  // InfoRow
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
    marginTop: 1,
  },

  // MenuBtn
  menuBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  menuSublabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: "#9ca3af",
  },

  // Switch
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  switchIcon: {
    fontSize: 18,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  switchSub: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
  },

  // Modal
  modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  fecharText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  modalInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    marginBottom: 12,
  },
  senhaLabel: {
    fontSize: 12,
    color: "#4A3F8F",
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: 2,
  },
  erroText: {
    fontSize: 12,
    color: "#A32D2D",
    textAlign: "center",
    marginBottom: 8,
  },
  modalAcoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnCancelarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
  btnSalvar: {
    flex: 1,
    backgroundColor: "#4A3F8F",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnSalvarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});