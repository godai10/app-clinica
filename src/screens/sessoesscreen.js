import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

// ─── Dados fictícios ──────────────────────────────────────────────────────────

const SESSOES = [
  {
    id: 1,
    psicologa: "Dra. Renata Oliveira",
    tipo: "Terapia Individual",
    date: "16 Abr",
    horario: "10:00",
    modalidade: "Online (Google Meet)",
    status: "done",
    initials: "RO",
    cor: "#534AB7",
    bg: "#EEEDFE",
    anotacao: "Sessão focada em técnicas de respiração e manejo da ansiedade.",
  },
  {
    id: 2,
    psicologa: "Dra. Renata Oliveira",
    tipo: "Terapia Individual",
    date: "23 Abr",
    horario: "10:00",
    modalidade: "Online (Google Meet)",
    status: "pending",
    initials: "RO",
    cor: "#534AB7",
    bg: "#EEEDFE",
    anotacao: null,
  },
  {
    id: 3,
    psicologa: "Dra. Camila Torres",
    tipo: "Avaliação Psicológica",
    date: "02 Mai",
    horario: "14:00",
    modalidade: "Presencial",
    status: "pending",
    initials: "CT",
    cor: "#0F6E56",
    bg: "#E1F5EE",
    anotacao: null,
  },
  {
    id: 4,
    psicologa: "Dra. Renata Oliveira",
    tipo: "Terapia Individual",
    date: "09 Abr",
    horario: "10:00",
    modalidade: "Online (Google Meet)",
    status: "done",
    initials: "RO",
    cor: "#534AB7",
    bg: "#EEEDFE",
    anotacao: "Trabalhamos questões relacionadas ao ambiente de trabalho e limites pessoais.",
  },
  {
    id: 5,
    psicologa: "Dra. Renata Oliveira",
    tipo: "Terapia Individual",
    date: "02 Abr",
    horario: "10:00",
    modalidade: "Online (Google Meet)",
    status: "cancelled",
    initials: "RO",
    cor: "#534AB7",
    bg: "#EEEDFE",
    anotacao: null,
  },
];

const FILTROS = [
  { id: "todas",     label: "Todas" },
  { id: "pending",   label: "Agendadas" },
  { id: "done",      label: "Realizadas" },
  { id: "cancelled", label: "Canceladas" },
];

const STATUS_MAP = {
  done:      { label: "Realizada", bg: "#EAF3DE", color: "#3B6D11" },
  pending:   { label: "Agendada",  bg: "#EEEDFE", color: "#534AB7" },
  cancelled: { label: "Cancelada", bg: "#FCEBEB", color: "#A32D2D" },
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Avatar({ initials, size = 44, bgColor = "#EEEDFE", textColor = "#534AB7" }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.33, color: textColor }]}>
        {initials}
      </Text>
    </View>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

// ─── Modal de detalhe ─────────────────────────────────────────────────────────

function DetalheModal({ sessao, onFechar }) {
  if (!sessao) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        {/* Cabeçalho */}
        <View style={styles.modalHeader}>
          <Avatar initials={sessao.initials} bgColor={sessao.bg} textColor={sessao.cor} size={48} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.modalPsicologa}>{sessao.psicologa}</Text>
            <Text style={styles.modalTipo}>{sessao.tipo}</Text>
          </View>
          <TouchableOpacity onPress={onFechar} style={styles.fecharBtn}>
            <Text style={styles.fecharText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Infos */}
        <View style={styles.modalInfoRow}>
          <Text style={styles.modalInfoIcon}>📅</Text>
          <Text style={styles.modalInfoText}>{sessao.date} às {sessao.horario}</Text>
        </View>
        <View style={styles.modalInfoRow}>
          <Text style={styles.modalInfoIcon}>📍</Text>
          <Text style={styles.modalInfoText}>{sessao.modalidade}</Text>
        </View>
        <View style={styles.modalInfoRow}>
          <Text style={styles.modalInfoIcon}>🏷️</Text>
          <StatusBadge status={sessao.status} />
        </View>

        {/* Anotação */}
        {sessao.anotacao && (
          <View style={styles.anotacaoBox}>
            <Text style={styles.anotacaoTitulo}>📝 Anotações da sessão</Text>
            <Text style={styles.anotacaoTexto}>{sessao.anotacao}</Text>
          </View>
        )}

        {/* Ações — só para sessões agendadas */}
        {sessao.status === "pending" && (
          <View style={styles.modalAcoes}>
            <TouchableOpacity style={styles.btnReagendar}>
              <Text style={styles.btnReagendarText}>Reagendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar}>
              <Text style={styles.btnCancelarText}>Cancelar sessão</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Card de sessão ───────────────────────────────────────────────────────────

function SessaoCard({ sessao, onPress }) {
  return (
    <TouchableOpacity style={styles.sessaoCard} onPress={() => onPress(sessao)}>
      <Avatar initials={sessao.initials} bgColor={sessao.bg} textColor={sessao.cor} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.sessaoPsicologa}>{sessao.psicologa}</Text>
        <Text style={styles.sessaoTipo}>{sessao.tipo}</Text>
        <Text style={styles.sessaoModalidade}>📍 {sessao.modalidade}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.sessaoDate}>{sessao.date}</Text>
        <Text style={styles.sessaoHorario}>{sessao.horario}</Text>
        <StatusBadge status={sessao.status} />
      </View>
    </TouchableOpacity>
  );
}

// ─── SessoesScreen principal ──────────────────────────────────────────────────

export default function SessoesScreen({ navigation }) {
  const [filtroAtivo, setFiltroAtivo] = useState("todas");
  const [sessaoSelecionada, setSessaoSelecionada] = useState(null);

  const sessoesFiltradas =
    filtroAtivo === "todas"
      ? SESSOES
      : SESSOES.filter((s) => s.status === filtroAtivo);

  // Contadores para cada filtro
  const contadores = {
    todas:     SESSOES.length,
    pending:   SESSOES.filter((s) => s.status === "pending").length,
    done:      SESSOES.filter((s) => s.status === "done").length,
    cancelled: SESSOES.filter((s) => s.status === "cancelled").length,
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Minhas Sessões</Text>
        <Text style={styles.headerSub}>{SESSOES.length} sessões no total</Text>
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtrosContainer}
      >
        {FILTROS.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFiltroAtivo(f.id)}
            style={[
              styles.filtroBtn,
              filtroAtivo === f.id && styles.filtroBtnAtivo,
            ]}
          >
            <Text
              style={[
                styles.filtroLabel,
                filtroAtivo === f.id && styles.filtroLabelAtivo,
              ]}
            >
              {f.label}
            </Text>
            <View style={[
              styles.filtroBadge,
              filtroAtivo === f.id && styles.filtroBadgeAtivo,
            ]}>
              <Text style={[
                styles.filtroBadgeText,
                filtroAtivo === f.id && styles.filtroBadgeTextAtivo,
              ]}>
                {contadores[f.id]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      >
        {sessoesFiltradas.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioemoji}>📭</Text>
            <Text style={styles.vazioTexto}>Nenhuma sessão encontrada</Text>
          </View>
        ) : (
          sessoesFiltradas.map((s) => (
            <SessaoCard
              key={s.id}
              sessao={s}
              onPress={setSessaoSelecionada}
            />
          ))
        )}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Modal de detalhe */}
      {sessaoSelecionada && (
        <DetalheModal
          sessao={sessaoSelecionada}
          onFechar={() => setSessaoSelecionada(null)}
        />
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },

  // Filtros
  filtrosContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filtroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  filtroBtnAtivo: {
    backgroundColor: "#4A3F8F",
    borderColor: "#4A3F8F",
  },
  filtroLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  filtroLabelAtivo: {
    color: "#fff",
  },
  filtroBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  filtroBadgeAtivo: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  filtroBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
  },
  filtroBadgeTextAtivo: {
    color: "#fff",
  },

  // Lista
  lista: {
    paddingHorizontal: 16,
    gap: 10,
  },

  // Card
  sessaoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  sessaoPsicologa: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  sessaoTipo: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  sessaoModalidade: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  sessaoDate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "right",
  },
  sessaoHorario: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
    textAlign: "right",
  },

  // Avatar
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "600",
  },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
  },

  // Vazio
  vazio: {
    alignItems: "center",
    marginTop: 60,
  },
  vazioemoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  vazioTexto: {
    fontSize: 14,
    color: "#9ca3af",
  },

  // Modal
  modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalPsicologa: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  modalTipo: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  fecharBtn: {
    padding: 6,
  },
  fecharText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#e5e7eb",
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  modalInfoIcon: {
    fontSize: 16,
  },
  modalInfoText: {
    fontSize: 13,
    color: "#374151",
  },
  anotacaoBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
  },
  anotacaoTitulo: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A3F8F",
    marginBottom: 6,
  },
  anotacaoTexto: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },
  modalAcoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  btnReagendar: {
    flex: 1,
    backgroundColor: "#EEEDFE",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnReagendarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A3F8F",
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: "#FCEBEB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnCancelarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A32D2D",
  },
});
