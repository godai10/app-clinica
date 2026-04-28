import React, { useState } from "react";

// ─── Dados fictícios (substituir pelos reais da API) ──────────────────────────

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
  { id: "agendar",  label: "Agendar",        icon: "📅", color: "#EEEDFE" },
  { id: "sessoes",  label: "Minhas sessões",  icon: "🧠", color: "#E1F5EE" },
  { id: "diario",   label: "Diário",          icon: "📓", color: "#FAEEDA" },
  { id: "recursos", label: "Recursos",        icon: "💆", color: "#FBEAF0" },
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
    <div style={{
      width: size, height: size, borderRadius: "50%",
      backgroundColor: bgColor, color: textColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
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
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 20,
      fontSize: 10, fontWeight: 500, backgroundColor: c.bg, color: c.color, marginTop: 4,
    }}>
      {c.label}
    </span>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ user, next }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #4A3F8F 0%, #2d2660 100%)",
      padding: "20px 16px 18px", color: "#fff",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>{getGreeting()},</p>
          <p style={{ fontSize: 18, fontWeight: 600, margin: "2px 0 0" }}>
            {user.name.split(" ")[0]} 🌸
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <Avatar initials={user.initials} size={42} bgColor="rgba(255,255,255,0.2)" textColor="#fff" />
          <div style={{
            position: "absolute", top: 1, right: 1, width: 10, height: 10,
            borderRadius: "50%", backgroundColor: "#A78BFA", border: "2px solid #4A3F8F",
          }} />
        </div>
      </div>

      {next && (
        <div style={{
          background: "rgba(255,255,255,0.13)", borderRadius: 14,
          padding: "12px 14px", border: "0.5px solid rgba(255,255,255,0.2)", cursor: "pointer",
        }}>
          <p style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>
            Próxima sessão
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{next.psicologa}</p>
              <p style={{ fontSize: 12, opacity: 0.8, margin: "3px 0 0" }}>{next.tipo} · {next.time}</p>
              <p style={{ fontSize: 11, opacity: 0.6, margin: "2px 0 0" }}>📍 {next.modalidade}</p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.18)", borderRadius: 10,
              padding: "8px 12px", textAlign: "center", minWidth: 52,
            }}>
              <p style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1 }}>{next.day}</p>
              <p style={{ fontSize: 10, opacity: 0.8, margin: "2px 0 0", textTransform: "uppercase" }}>{next.month}</p>
            </div>
          </div>
        </div>
      )}
    </div>
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
    <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e5e7eb", padding: "14px" }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 2px" }}>
        Como você está hoje?
      </p>
      <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 12px" }}>
        Registre seu humor para acompanhar seu bem-estar
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {opcoes.map((o) => (
          <button
            key={o.label}
            onClick={() => setHumor(o.label)}
            style={{
              flex: 1, padding: "10px 4px", borderRadius: 10,
              border: humor === o.label ? `2px solid ${o.cor}` : "0.5px solid #e5e7eb",
              background: humor === o.label ? o.bg : "#f9fafb",
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 22 }}>{o.emoji}</span>
            <span style={{ fontSize: 10, color: humor === o.label ? o.cor : "#9ca3af", fontWeight: humor === o.label ? 600 : 400 }}>
              {o.label}
            </span>
          </button>
        ))}
      </div>
      {humor && (
        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10, textAlign: "center" }}>
          ✅ Humor registrado: <strong>{humor}</strong>
        </p>
      )}
    </div>
  );
}

// ─── Dica do dia ─────────────────────────────────────────────────────────────
function DicaDia({ dica }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #EEEDFE 0%, #f5f3ff 100%)",
      borderRadius: 12, border: "0.5px solid #C4C0F0", padding: "14px",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 26 }}>{dica.icone}</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#3730A3", margin: "0 0 4px" }}>
            {dica.titulo}
          </p>
          <p style={{ fontSize: 12, color: "#534AB7", lineHeight: 1.5, margin: 0 }}>
            {dica.texto}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sessões recentes ─────────────────────────────────────────────────────────
function SessoesList({ sessoes, onPress }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={styles.sectionTitle}>Minhas sessões</p>
        <button style={styles.linkBtn}>Ver todas</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sessoes.map((s) => (
          <div
            key={s.id}
            onClick={() => onPress && onPress(s)}
            style={{
              background: "#fff", borderRadius: 10, border: "0.5px solid #e5e7eb",
              padding: "12px", display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer", transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#9ca3af")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          >
            <Avatar initials={s.initials} bgColor={s.bg} textColor={s.cor} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", margin: 0 }}>{s.psicologa}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>{s.tipo}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{s.date}</p>
              <StatusBadge status={s.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
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
    <div style={{
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 14px", borderTop: "0.5px solid #e5e7eb", background: "#fff",
    }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange && onChange(t.id)}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "4px 14px", background: "none", border: "none", cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: active === t.id ? "#4A3F8F" : "#9ca3af" }}>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = {
  sectionTitle: { fontSize: 13, fontWeight: 500, color: "#6b7280", margin: 0 },
  linkBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 12, color: "#4A3F8F", fontWeight: 500, padding: 0,
  },
};

// ─── HomeScreen principal ─────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      maxWidth: 480, margin: "0 auto", overflow: "hidden",
    }}>
      <Header user={USER} next={NEXT_APPOINTMENT} />

      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: 16,
        scrollbarWidth: "none",
      }}>
        {/* Ações rápidas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {RECURSOS.map((r) => (
            <button
              key={r.id}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "10px 4px 8px", background: "#fff", borderRadius: 10,
                border: "0.5px solid #e5e7eb", cursor: "pointer",
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.07)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {r.icon}
              </div>
              <span style={{ fontSize: 10, color: "#6b7280", textAlign: "center", lineHeight: 1.3 }}>{r.label}</span>
            </button>
          ))}
        </div>

        <HumorDia />
        <DicaDia dica={DICA_DIA} />
        <SessoesList sessoes={APPOINTMENTS} onPress={(s) => { /* navigation.navigate('SessaoDetalhe', { id: s.id }) */ }} />

        <div style={{ height: 8 }} />
      </div>

      <BottomNav active={activeTab} onChange={(tab) => { setActiveTab(tab); /* navigation.navigate(tab) */ }} />
    </div>
  );
}