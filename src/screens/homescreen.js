import React, { useState, useEffect } from "react";

// ─── Dados fictícios ──────────────────────────────────────────────────────────
const USER = { name: "Mariana Costa", initials: "MC" };

const NEXT_APPOINTMENT = {
  psicologa: "Dra. Renata Oliveira",
  tipo: "Terapia Individual",
  time: "10:00",
  day: "23",
  month: "Abr",
  modalidade: "Online (Google Meet)",
};

const APPOINTMENTS = [
  { id: 1, psicologa: "Dra. Renata Oliveira", tipo: "Terapia Individual",    date: "16 Abr", status: "done",    initials: "RO", cor: "#534AB7", bg: "#EEEDFE" },
  { id: 2, psicologa: "Dra. Renata Oliveira", tipo: "Terapia Individual",    date: "23 Abr", status: "pending", initials: "RO", cor: "#534AB7", bg: "#EEEDFE" },
  { id: 3, psicologa: "Dra. Camila Torres",   tipo: "Avaliação Psicológica", date: "02 Mai", status: "pending", initials: "CT", cor: "#0F6E56", bg: "#E1F5EE" },
  { id: 4, psicologa: "Dra. Beatriz Santos",  tipo: "Terapia de Casal",      date: "10 Mai", status: "pending", initials: "BS", cor: "#993556", bg: "#FBEAF0" },
];

const QUICK_ACTIONS = [
  { id: "agendar",  label: "Agendar",       icon: "📅", color: "#EEEDFE" },
  { id: "sessoes",  label: "Minhas sessões", icon: "🧠", color: "#E1F5EE" },
  { id: "diario",   label: "Diário",         icon: "📓", color: "#FAEEDA" },
  { id: "recursos", label: "Recursos",       icon: "💆", color: "#FBEAF0" },
];

const HUMOR_OPTIONS = [
  { label: "Ótimo",   emoji: "😄", cor: "#3B6D11", bg: "#EAF3DE" },
  { label: "Bem",     emoji: "🙂", cor: "#185FA5", bg: "#E6F1FB" },
  { label: "Regular", emoji: "😐", cor: "#854F0B", bg: "#FAEEDA" },
  { label: "Mal",     emoji: "😔", cor: "#993556", bg: "#FBEAF0" },
];

const DICA = {
  titulo: "Respire fundo",
  texto: "Tire 5 minutos hoje para praticar respiração diafragmática. Isso ajuda a reduzir a ansiedade e acalmar o sistema nervoso.",
  icone: "🌿",
};

const STATS = [
  { label: "Sessões realizadas", value: "12",  icon: "🧠" },
  { label: "Semanas em terapia", value: "6",   icon: "📅" },
  { label: "Entradas no diário", value: "28",  icon: "📓" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

// ─── Sub-componentes compartilhados ───────────────────────────────────────────
function Avatar({ initials, size = 40, bgColor = "#EEEDFE", textColor = "#534AB7" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      backgroundColor: bgColor, color: textColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, flexShrink: 0,
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
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, backgroundColor: c.bg, color: c.color,
    }}>
      {c.label}
    </span>
  );
}

// ─── Sidebar (somente desktop) ────────────────────────────────────────────────
function Sidebar({ active, onChange }) {
  const items = [
    { id: "home",     icon: "🏠", label: "Início" },
    { id: "agendar",  icon: "📅", label: "Agendar" },
    { id: "sessoes",  icon: "🧠", label: "Sessões" },
    { id: "diario",   icon: "📓", label: "Diário" },
    { id: "recursos", icon: "💆", label: "Recursos" },
    { id: "perfil",   icon: "👤", label: "Perfil" },
  ];
  return (
    <aside style={{
      width: 220,
      minHeight: "100vh",
      background: "linear-gradient(180deg, #2d2660 0%, #4A3F8F 100%)",
      display: "flex",
      flexDirection: "column",
      padding: "28px 0",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌸</div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>MenteCuidada</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Clínica de Psicologia</p>
          </div>
        </div>
      </div>

      {/* Perfil do usuário */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={USER.initials} size={38} bgColor="rgba(255,255,255,0.2)" textColor="#fff" />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff" }}>{USER.name}</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Paciente</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10, border: "none",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                cursor: "pointer", textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}>
                {item.label}
              </span>
              {isActive && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#A78BFA" }} />}
            </button>
          );
        })}
      </nav>

      {/* Sair */}
      <div style={{ padding: "0 12px" }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 10, border: "none",
          background: "transparent", cursor: "pointer", width: "100%",
        }}>
          <span style={{ fontSize: 16 }}>🚪</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Sair</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Bottom Nav (somente mobile) ──────────────────────────────────────────────
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
      position: "sticky", bottom: 0,
    }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "4px 14px", background: "none", border: "none", cursor: "pointer",
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: active === t.id ? "#4A3F8F" : "#9ca3af" }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Header (desktop topbar) ──────────────────────────────────────────────────
function DesktopTopbar() {
  return (
    <div style={{
      background: "#fff", borderBottom: "0.5px solid #e5e7eb",
      padding: "14px 28px", display: "flex", alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
          {getGreeting()}, {USER.name.split(" ")[0]} 🌸
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
          Aqui está um resumo do seu acompanhamento
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button style={{
          background: "#4A3F8F", color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 18px", fontSize: 13,
          fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          📅 Agendar sessão
        </button>
        <div style={{ position: "relative" }}>
          <Avatar initials={USER.initials} size={40} bgColor="#EEEDFE" textColor="#4A3F8F" />
          <div style={{ position: "absolute", top: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#A78BFA", border: "2px solid #fff" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Header ────────────────────────────────────────────────────────────
function MobileHeader() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #4A3F8F 0%, #2d2660 100%)",
      padding: "20px 16px 18px", color: "#fff",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, opacity: 0.7, margin: 0 }}>{getGreeting()},</p>
          <p style={{ fontSize: 18, fontWeight: 700, margin: "2px 0 0" }}>{USER.name.split(" ")[0]} 🌸</p>
        </div>
        <div style={{ position: "relative" }}>
          <Avatar initials={USER.initials} size={42} bgColor="rgba(255,255,255,0.2)" textColor="#fff" />
          <div style={{ position: "absolute", top: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "#A78BFA", border: "2px solid #4A3F8F" }} />
        </div>
      </div>
      {/* Próxima sessão */}
      <div style={{
        background: "rgba(255,255,255,0.13)", borderRadius: 14,
        padding: "12px 14px", border: "0.5px solid rgba(255,255,255,0.2)",
      }}>
        <p style={{ fontSize: 9, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>Próxima sessão</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{NEXT_APPOINTMENT.psicologa}</p>
            <p style={{ fontSize: 11, opacity: 0.8, margin: "3px 0 0" }}>{NEXT_APPOINTMENT.tipo} · {NEXT_APPOINTMENT.time}</p>
            <p style={{ fontSize: 10, opacity: 0.6, margin: "2px 0 0" }}>📍 {NEXT_APPOINTMENT.modalidade}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "8px 12px", textAlign: "center", minWidth: 50 }}>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1 }}>{NEXT_APPOINTMENT.day}</p>
            <p style={{ fontSize: 9, opacity: 0.8, margin: "2px 0 0", textTransform: "uppercase" }}>{NEXT_APPOINTMENT.month}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Cards (desktop) ────────────────────────────────────────────────────
function StatsCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {STATS.map((s) => (
        <div key={s.label} style={{
          background: "#fff", borderRadius: 14, padding: "20px",
          border: "0.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {s.icon}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{s.value}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Próxima Sessão (desktop card) ────────────────────────────────────────────
function NextSessionCard() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #4A3F8F 0%, #2d2660 100%)",
      borderRadius: 16, padding: "20px 24px", color: "#fff", marginBottom: 24,
    }}>
      <p style={{ margin: "0 0 14px", fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Próxima sessão
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar initials="RO" size={52} bgColor="rgba(255,255,255,0.2)" textColor="#fff" />
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{NEXT_APPOINTMENT.psicologa}</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8 }}>{NEXT_APPOINTMENT.tipo}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.65 }}>📍 {NEXT_APPOINTMENT.modalidade}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{NEXT_APPOINTMENT.day}</p>
            <p style={{ margin: "3px 0 0", fontSize: 11, opacity: 0.8, textTransform: "uppercase" }}>{NEXT_APPOINTMENT.month}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{NEXT_APPOINTMENT.time}</p>
            <p style={{ margin: "3px 0 0", fontSize: 11, opacity: 0.8 }}>Horário</p>
          </div>
          <button style={{
            background: "#fff", color: "#4A3F8F", border: "none",
            borderRadius: 10, padding: "10px 16px", fontSize: 13,
            fontWeight: 600, cursor: "pointer",
          }}>
            Entrar na sessão →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Humor do dia ─────────────────────────────────────────────────────────────
function HumorDia({ compact = false }) {
  const [humor, setHumor] = useState(null);
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "0.5px solid #e5e7eb",
      padding: compact ? "14px" : "20px",
    }}>
      <p style={{ fontSize: compact ? 12 : 14, fontWeight: 600, color: "#374151", margin: "0 0 2px" }}>Como você está hoje?</p>
      <p style={{ fontSize: compact ? 10 : 12, color: "#9ca3af", margin: "0 0 12px" }}>Registre seu humor</p>
      <div style={{ display: "flex", gap: compact ? 7 : 10 }}>
        {HUMOR_OPTIONS.map((o) => (
          <button key={o.label} onClick={() => setHumor(o.label)} style={{
            flex: 1, padding: compact ? "8px 4px" : "12px 6px", borderRadius: 10,
            border: humor === o.label ? `2px solid ${o.cor}` : "0.5px solid #e5e7eb",
            background: humor === o.label ? o.bg : "#f9fafb",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: compact ? 20 : 24 }}>{o.emoji}</span>
            <span style={{ fontSize: compact ? 9 : 11, color: humor === o.label ? o.cor : "#9ca3af", fontWeight: humor === o.label ? 600 : 400 }}>
              {o.label}
            </span>
          </button>
        ))}
      </div>
      {humor && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10, textAlign: "center" }}>✅ Humor registrado: <strong>{humor}</strong></p>}
    </div>
  );
}

// ─── Dica do dia ─────────────────────────────────────────────────────────────
function DicaDia({ compact = false }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #EEEDFE, #f5f3ff)",
      borderRadius: 14, border: "0.5px solid #C4C0F0",
      padding: compact ? "14px" : "20px",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: compact ? 24 : 30 }}>{DICA.icone}</span>
        <div>
          <p style={{ fontSize: compact ? 12 : 14, fontWeight: 600, color: "#3730A3", margin: "0 0 4px" }}>{DICA.titulo}</p>
          <p style={{ fontSize: compact ? 11 : 13, color: "#534AB7", lineHeight: 1.5, margin: 0 }}>{DICA.texto}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sessões recentes ─────────────────────────────────────────────────────────
function SessoesList({ compact = false }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "0.5px solid #e5e7eb",
      padding: compact ? "14px" : "20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: compact ? 12 : 14, fontWeight: 600, color: "#374151" }}>Sessões recentes</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#4A3F8F", fontWeight: 500 }}>Ver todas</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {APPOINTMENTS.map((a) => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px", borderRadius: 10,
            background: "#f9fafb", border: "0.5px solid #f3f4f6",
            cursor: "pointer", transition: "background 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f9fafb")}
          >
            <Avatar initials={a.initials} size={38} bgColor={a.bg} textColor={a.cor} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#111827" }}>{a.psicologa}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{a.tipo}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>{a.date}</p>
              <StatusBadge status={a.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HomeScreen principal ─────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("home");

  // ── Layout MOBILE ──
  if (isMobile) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      }}>
        <MobileHeader />
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Quick actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {QUICK_ACTIONS.map((r) => (
              <button key={r.id} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "10px 4px 8px", background: "#fff", borderRadius: 10,
                border: "0.5px solid #e5e7eb", cursor: "pointer",
                transition: "transform 0.1s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{r.icon}</div>
                <span style={{ fontSize: 9, color: "#6b7280", textAlign: "center" }}>{r.label}</span>
              </button>
            ))}
          </div>
          <HumorDia compact />
          <DicaDia compact />
          <SessoesList compact />
          <div style={{ height: 8 }} />
        </div>
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  // ── Layout DESKTOP ──
  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    }}>
      <Sidebar active={activeTab} onChange={setActiveTab} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <DesktopTopbar />

        <main style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
          {/* Stats */}
          <StatsCards />

          {/* Próxima sessão */}
          <NextSessionCard />

          {/* Grid 2 colunas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <HumorDia />
            <DicaDia />
          </div>

          {/* Sessões full width */}
          <SessoesList />
        </main>
      </div>
    </div>
  );
}