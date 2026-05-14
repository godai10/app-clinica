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

const USER = {
  name: "Mariana Costa",
  initials: "MC",
};

const NEXT_APPOINTMENT = {
  psicologa: "Dra. Renata Oliveira",
  tipo: "Terapia Individual",
  time: "10:00",
  day: "23",
  month: "Abr",
  modalidade: "Online (Google Meet)",
};

const APPOINTMENTS = [
  {
    id: 1,
    psicologa: "Dra. Renata Oliveira",
    tipo: "Terapia Individual",
    date: "16 Abr",
    status: "done",
    initials: "RO",
    cor: "#534AB7",
    bg: "#EEEDFE",
  },
  {
    id: 2,
    psicologa: "Dra. Renata Oliveira",
    tipo: "Terapia Individual",
    date: "23 Abr",
    status: "pending",
    initials: "RO",
    cor: "#534AB7",
    bg: "#EEEDFE",
  },
  {
    id: 3,
    psicologa: "Dra. Camila Torres",
    tipo: "Avaliação Psicológica",
    date: "02 Mai",
    status: "pending",
    initials: "CT",
    cor: "#0F6E56",
    bg: "#E1F5EE",
  },
];

const RECURSOS = [
  { id: "agendar",  label: "Agendar",       icon: "📅", color: "#EEEDFE" },
  { id: "sessoes",  label: "Minhas sessões", icon: "🧠", color: "#E1F5EE" },
  { id: "diario",   label: "Diário",         icon: "📓", color: "#FAEEDA" },
  { id: "recursos", label: "Recursos",       icon: "💆", color: "#FBEAF0" },
];

const DICA_DIA = {
  titulo: "Respire fundo",
  texto:
    "Tire 5 minutos hoje para praticar respiração diafragmática. Isso ajuda a reduzir a ansiedade e acalmar o sistema nervoso.",
  icone: "🌿",
};

// ─── Utilitários ──────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Avatar({ initials, size = 40, bgColor = "#EEEDFE", textColor = "#534AB7" }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.33, color: textColor }]}>
        {initials}
      </Text>
    </View>
  );
}

function StatusBadge({ status }) {
  const map = {
    done:      { label: "Realizada", bg: "#EAF3DE", color: "#3B6D11" },
    pending:   { label: "Agendada",  bg: "#EEEDFE", color: "#534AB7" },
    cancelled: { label: "Cancelada", bg: "#FCEBEB", color: "#A32D2D" },
  };
  const c = map[status] || map.pending;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ user, next }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerGreeting}>{getGreeting()},</Text>
          <Text style={styles.headerName}>
            {user.name.split(" ")[0]} 🌸
          </Text>
        </View>
        <View>
          <Avatar
            initials={user.initials}
            size={42}
            bgColor="rgba(255,255,255,0.2)"
            textColor="#fff"
          />
          <View style={styles.onlineDot} />
        </View>
      </View>

      {next && (
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>Próxima sessão</Text>
          <View style={styles.nextRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextPsicologa}>{next.psicologa}</Text>
              <Text style={styles.nextTipo}>
                {next.tipo} · {next.time}
              </Text>
              <Text style={styles.nextModalidade}>📍 {next.modalidade}</Text>
            </View>
            <View style={styles.nextDateBox}>
              <Text style={styles.nextDay}>{next.day}</Text>
              <Text style={styles.nextMonth}>{next.month}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Humor do dia ─────────────────────────────────────────────────────────────

function HumorDia() {
  const [humor, setHumor] = useState(null);
  const opcoes = [
    { label: "Ótimo",   emoji: "😄", cor: "#3B6D11", bg: "#EAF3DE" },
    { label: "Bem",     emoji: "🙂", cor: "#185FA5", bg: "#E6F1FB" },
    { label: "Regular", emoji: "😐", cor: "#854F0B", bg: "#FAEEDA" },
    { label: "Mal",     emoji: "😔", cor: "#993556", bg: "#FBEAF0" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Como você está hoje?</Text>
      <Text style={styles.cardSubtitle}>
        Registre seu humor para acompanhar seu bem-estar
      </Text>
      <View style={styles.humorRow}>
        {opcoes.map((o) => (
          <TouchableOpacity
            key={o.label}
            onPress={() => setHumor(o.label)}
            style={[
              styles.humorBtn,
              humor === o.label && {
                borderColor: o.cor,
                borderWidth: 2,
                backgroundColor: o.bg,
              },
            ]}
          >
            <Text style={styles.humorEmoji}>{o.emoji}</Text>
            <Text
              style={[
                styles.humorLabel,
                humor === o.label && { color: o.cor, fontWeight: "600" },
              ]}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {humor && (
        <Text style={styles.humorResult}>
          ✅ Humor registrado: <Text style={{ fontWeight: "600" }}>{humor}</Text>
        </Text>
      )}
    </View>
  );
}

// ─── Dica do dia ─────────────────────────────────────────────────────────────

function DicaDia({ dica }) {
  return (
    <View style={styles.dicaCard}>
      <View style={styles.dicaRow}>
        <Text style={styles.dicaIcon}>{dica.icone}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.dicaTitulo}>{dica.titulo}</Text>
          <Text style={styles.dicaTexto}>{dica.texto}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Sessões recentes ─────────────────────────────────────────────────────────

function SessoesList({ sessoes, onPress }) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Minhas sessões</Text>
        <TouchableOpacity>
          <Text style={styles.linkBtn}>Ver todas</Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 8 }}>
        {sessoes.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => onPress && onPress(s)}
            style={styles.sessaoCard}
          >
            <Avatar initials={s.initials} bgColor={s.bg} textColor={s.cor} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sessaoPsicologa}>{s.psicologa}</Text>
              <Text style={styles.sessaoTipo}>{s.tipo}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.sessaoDate}>{s.date}</Text>
              <StatusBadge status={s.status} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav({ active, onChange }) {
  const tabs = [
    { id: "home",    label: "Início",  icon: "🏠" },
    { id: "agendar", label: "Agendar", icon: "📅" },
    { id: "diario",  label: "Diário",  icon: "📓" },
    { id: "perfil",  label: "Perfil",  icon: "👤" },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.id}
          onPress={() => onChange && onChange(t.id)}
          style={styles.tabBtn}
        >
          <Text style={styles.tabIcon}>{t.icon}</Text>
          <Text
            style={[
              styles.tabLabel,
              { color: active === t.id ? "#4A3F8F" : "#9ca3af" },
            ]}
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── HomeScreen principal ─────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <SafeAreaView style={styles.container}>
      <Header user={USER} next={NEXT_APPOINTMENT} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ações rápidas */}
        <View style={styles.recursosGrid}>
          {RECURSOS.map((r) => (
            <TouchableOpacity key={r.id} style={styles.recursoBtn}>
              <View style={[styles.recursoIcon, { backgroundColor: r.color }]}>
                <Text style={styles.recursoEmoji}>{r.icon}</Text>
              </View>
              <Text style={styles.recursoLabel}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <HumorDia />
        <DicaDia dica={DICA_DIA} />
        <SessoesList
          sessoes={APPOINTMENTS}
          onPress={(s) => {
            // navigation.navigate('SessaoDetalhe', { id: s.id })
          }}
        />
        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNav
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          // navigation.navigate(tab)
        }}
      />
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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

  // Header
  header: {
    backgroundColor: "#4A3F8F",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerGreeting: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 2,
  },
  onlineDot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#A78BFA",
    borderWidth: 2,
    borderColor: "#4A3F8F",
  },
  nextCard: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.2)",
  },
  nextLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  nextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextPsicologa: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  nextTipo: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 3,
  },
  nextModalidade: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  nextDateBox: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    minWidth: 52,
  },
  nextDay: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 26,
  },
  nextMonth: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    marginTop: 2,
  },

  // Scroll
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // Recursos
  recursosGrid: {
    flexDirection: "row",
    gap: 8,
  },
  recursoBtn: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    gap: 6,
  },
  recursoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recursoEmoji: {
    fontSize: 18,
  },
  recursoLabel: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 14,
  },

  // Card genérico
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    padding: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 12,
  },

  // Humor
  humorRow: {
    flexDirection: "row",
    gap: 8,
  },
  humorBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    gap: 4,
  },
  humorEmoji: {
    fontSize: 22,
  },
  humorLabel: {
    fontSize: 10,
    color: "#9ca3af",
  },
  humorResult: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 10,
    textAlign: "center",
  },

  // Dica
  dicaCard: {
    backgroundColor: "#EEEDFE",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#C4C0F0",
    padding: 14,
  },
  dicaRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  dicaIcon: {
    fontSize: 26,
  },
  dicaTitulo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3730A3",
    marginBottom: 4,
  },
  dicaTexto: {
    fontSize: 12,
    color: "#534AB7",
    lineHeight: 18,
  },

  // Sessões
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
  },
  linkBtn: {
    fontSize: 12,
    color: "#4A3F8F",
    fontWeight: "500",
  },
  sessaoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sessaoPsicologa: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  sessaoTipo: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  sessaoDate: {
    fontSize: 11,
    color: "#6b7280",
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  tabBtn: {
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: "500",
  },
});