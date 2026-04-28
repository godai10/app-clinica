import React, { useState } from "react";

// ─── Dados fictícios (substituir pelos reais da API) ──────────────────────────

const TIPOS_SESSAO = [
  { id: 1, nome: "Terapia Individual",      icone: "🧠", descricao: "Sessão focada em você" },
  { id: 2, nome: "Terapia de Casal",        icone: "💑", descricao: "Para casais e relacionamentos" },
  { id: 3, nome: "Terapia Familiar",        icone: "👨‍👩‍👧", descricao: "Dinâmica e conflitos familiares" },
  { id: 4, nome: "Avaliação Psicológica",   icone: "📋", descricao: "Laudos e relatórios clínicos" },
];

const PSICOLOGAS = [
  {
    id: 1,
    nome: "Dra. Renata Oliveira",
    crp: "CRP 06/123456",
    abordagem: "Terapia Cognitivo-Comportamental (TCC)",
    tiposIds: [1, 2],
    avaliacao: 4.9,
    sessoes: 830,
    initials: "RO",
    cor: "#534AB7",
    bg: "#EEEDFE",
    bio: "Especialista em ansiedade, depressão e relacionamentos. Atendimento online e presencial.",
    modalidades: ["Presencial", "Online"],
  },
  {
    id: 2,
    nome: "Dra. Camila Torres",
    crp: "CRP 06/234567",
    abordagem: "Psicanálise",
    tiposIds: [1, 4],
    avaliacao: 4.8,
    sessoes: 640,
    initials: "CT",
    cor: "#0F6E56",
    bg: "#E1F5EE",
    bio: "Atua com autoconhecimento, traumas e avaliações psicológicas. Atendimento presencial.",
    modalidades: ["Presencial"],
  },
  {
    id: 3,
    nome: "Dra. Beatriz Santos",
    crp: "CRP 06/345678",
    abordagem: "Terapia Sistêmica",
    tiposIds: [2, 3],
    avaliacao: 4.9,
    sessoes: 510,
    initials: "BS",
    cor: "#993556",
    bg: "#FBEAF0",
    bio: "Especialista em terapia de casal e família. Foco em comunicação e vínculos afetivos.",
    modalidades: ["Online", "Presencial"],
  },
  {
    id: 4,
    nome: "Dra. Larissa Mendes",
    crp: "CRP 06/456789",
    abordagem: "Gestalt-terapia",
    tiposIds: [1, 3],
    avaliacao: 4.7,
    sessoes: 390,
    initials: "LM",
    cor: "#854F0B",
    bg: "#FAEEDA",
    bio: "Atendimento com foco em presença, emoções e autoconhecimento. Online e presencial.",
    modalidades: ["Online", "Presencial"],
  },
];

const MODALIDADES = [
  { id: "presencial", label: "Presencial", icon: "🏢" },
  { id: "online",     label: "Online",     icon: "💻" },
];

// Horários disponíveis fictícios
const HORAS_BASE = [
  "08:00","09:00","10:00","11:00",
  "13:00","14:00","15:00","16:00","17:00","18:00",
];
const OCUPADOS = [1, 4, 7];
const HORAS = HORAS_BASE.map((h, i) => ({ hora: h, disponivel: !OCUPADOS.includes(i) }));

// Próximos 14 dias
function gerarDias() {
  const dias = [];
  const nomes = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const hoje = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    dias.push({
      id: i,
      diaSemana: nomes[d.getDay()],
      dia: d.getDate(),
      mes: meses[d.getMonth()],
      dataCompleta: d.toLocaleDateString("pt-BR"),
      desabilitado: d.getDay() === 0,
    });
  }
  return dias;
}

const DIAS = gerarDias();
const STEPS = ["Tipo de sessão", "Psicóloga", "Data & Hora", "Confirmação"];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Avatar({ initials, size = 44, bgColor = "#EEEDFE", textColor = "#534AB7" }) {
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

function StepIndicator({ currentStep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 16px 4px", background: "#fff" }}>
      {STEPS.map((step, i) => (
        <React.Fragment key={i}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              backgroundColor: i <= currentStep ? "#4A3F8F" : "#e5e7eb",
              color: i <= currentStep ? "#fff" : "#9ca3af",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 600, transition: "all 0.3s",
            }}>
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 8, whiteSpace: "nowrap",
              color: i <= currentStep ? "#4A3F8F" : "#9ca3af",
              fontWeight: i === currentStep ? 600 : 400,
            }}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: "0 5px", marginBottom: 16,
              backgroundColor: i < currentStep ? "#4A3F8F" : "#e5e7eb",
              transition: "background-color 0.3s",
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── STEP 1: Tipo de sessão ───────────────────────────────────────────────────
function StepTipo({ selected, onSelect }) {
  return (
    <div style={{ padding: "20px 16px" }}>
      <p style={styles.stepTitle}>Que tipo de sessão você precisa?</p>
      <p style={styles.stepSub}>Selecione o formato que melhor se encaixa</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {TIPOS_SESSAO.map((t) => {
          const sel = selected?.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 12, textAlign: "left",
                border: sel ? "2px solid #4A3F8F" : "0.5px solid #e5e7eb",
                background: sel ? "#EEEDFE" : "#fff", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 28 }}>{t.icone}</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: sel ? 600 : 500, color: sel ? "#4A3F8F" : "#111827" }}>
                  {t.nome}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{t.descricao}</p>
              </div>
              {sel && (
                <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: "#4A3F8F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 2: Psicóloga + modalidade ──────────────────────────────────────────
function StepPsicologa({ tipo, selected, modalidade, onSelect, onModalidade }) {
  const lista = PSICOLOGAS.filter((p) => p.tiposIds.includes(tipo.id));

  return (
    <div style={{ padding: "20px 16px" }}>
      <p style={styles.stepTitle}>Escolha a psicóloga</p>
      <p style={styles.stepSub}>{lista.length} profissional(is) disponível(is) para {tipo.nome}</p>

      {/* Modalidade */}
      <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
        {MODALIDADES.map((m) => (
          <button
            key={m.id}
            onClick={() => onModalidade(m.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 20,
              border: modalidade === m.id ? "2px solid #4A3F8F" : "0.5px solid #e5e7eb",
              background: modalidade === m.id ? "#EEEDFE" : "#fff",
              fontSize: 13, color: modalidade === m.id ? "#4A3F8F" : "#374151",
              fontWeight: modalidade === m.id ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lista.map((p) => {
          const sel = selected?.id === p.id;
          const temModalidade = !modalidade || p.modalidades.some(
            (m) => m.toLowerCase() === (modalidade === "online" ? "online" : "presencial")
          );
          return (
            <button
              key={p.id}
              onClick={() => temModalidade && onSelect(p)}
              disabled={!temModalidade}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "14px 12px", borderRadius: 12, textAlign: "left",
                border: sel ? "2px solid #4A3F8F" : "0.5px solid #e5e7eb",
                background: sel ? "#EEEDFE" : temModalidade ? "#fff" : "#f9fafb",
                cursor: temModalidade ? "pointer" : "not-allowed",
                opacity: temModalidade ? 1 : 0.5, transition: "all 0.15s",
              }}
            >
              <Avatar initials={p.initials} bgColor={p.bg} textColor={p.cor} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{p.nome}</p>
                <p style={{ margin: "1px 0 0", fontSize: 10, color: "#9ca3af" }}>{p.crp}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#534AB7", fontWeight: 500 }}>{p.abordagem}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4b5563", lineHeight: 1.4 }}>{p.bio}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600 }}>⭐ {p.avaliacao}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{p.sessoes} sessões</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {p.modalidades.map((m) => (
                      <span key={m} style={{ fontSize: 9, background: "#f3f4f6", color: "#6b7280", padding: "2px 6px", borderRadius: 10 }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
              {sel && (
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#4A3F8F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 3: Data & Hora ──────────────────────────────────────────────────────
function StepDataHora({ dia, hora, onDia, onHora }) {
  return (
    <div style={{ padding: "20px 16px" }}>
      <p style={styles.stepTitle}>Data e horário</p>
      <p style={styles.stepSub}>Escolha quando você quer ser atendida</p>

      <div style={{
        display: "flex", gap: 8, overflowX: "auto",
        paddingBottom: 8, marginTop: 16, scrollbarWidth: "none",
      }}>
        {DIAS.map((d) => {
          const sel = dia?.id === d.id;
          return (
            <button
              key={d.id}
              onClick={() => !d.desabilitado && onDia(d)}
              disabled={d.desabilitado}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "9px 7px", borderRadius: 12, minWidth: 50, flexShrink: 0,
                border: sel ? "2px solid #4A3F8F" : "0.5px solid #e5e7eb",
                background: sel ? "#4A3F8F" : d.desabilitado ? "#f9fafb" : "#fff",
                color: sel ? "#fff" : d.desabilitado ? "#d1d5db" : "#374151",
                cursor: d.desabilitado ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 500 }}>{d.diaSemana}</span>
              <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{d.dia}</span>
              <span style={{ fontSize: 9 }}>{d.mes}</span>
            </button>
          );
        })}
      </div>

      {dia ? (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", margin: "0 0 10px" }}>
            Horários disponíveis — {dia.dataCompleta}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {HORAS.map((h) => {
              const sel = hora?.hora === h.hora;
              return (
                <button
                  key={h.hora}
                  onClick={() => h.disponivel && onHora(h)}
                  disabled={!h.disponivel}
                  style={{
                    padding: "10px 4px", borderRadius: 8, fontSize: 13,
                    border: sel ? "2px solid #4A3F8F" : "0.5px solid #e5e7eb",
                    background: sel ? "#4A3F8F" : !h.disponivel ? "#f3f4f6" : "#fff",
                    color: sel ? "#fff" : !h.disponivel ? "#d1d5db" : "#374151",
                    fontWeight: sel ? 600 : 400,
                    textDecoration: !h.disponivel ? "line-through" : "none",
                    cursor: h.disponivel ? "pointer" : "not-allowed",
                    transition: "all 0.15s",
                  }}
                >
                  {h.hora}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {[
              { bg: "#fff", border: "0.5px solid #e5e7eb", label: "Disponível" },
              { bg: "#f3f4f6", border: "none", label: "Ocupado" },
              { bg: "#4A3F8F", border: "none", label: "Selecionado" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 11, height: 11, borderRadius: 3, background: l.bg, border: l.border }} />
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          marginTop: 20, padding: 24, textAlign: "center",
          color: "#9ca3af", fontSize: 13, background: "#f9fafb",
          borderRadius: 12, border: "0.5px dashed #e5e7eb",
        }}>
          👆 Selecione um dia para ver os horários
        </div>
      )}
    </div>
  );
}

// ─── STEP 4: Confirmação ──────────────────────────────────────────────────────
function StepConfirmacao({ tipo, psicologa, dia, hora, modalidade, onConfirmar, loading }) {
  const local = modalidade === "online"
    ? "Online (link enviado por e-mail)"
    : "Clínica Mental — Rua das Flores, 142";

  return (
    <div style={{ padding: "20px 16px" }}>
      <p style={styles.stepTitle}>Confirme sua sessão</p>
      <p style={styles.stepSub}>Revise os detalhes antes de confirmar</p>

      <div style={{
        background: "#fff", border: "0.5px solid #e5e7eb",
        borderRadius: 16, overflow: "hidden", marginTop: 16,
      }}>
        <div style={{
          background: "linear-gradient(135deg, #4A3F8F 0%, #2d2660 100%)",
          padding: "16px", display: "flex", alignItems: "center", gap: 12,
        }}>
          <Avatar initials={psicologa.initials} bgColor="rgba(255,255,255,0.2)" textColor="#fff" size={48} />
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#fff" }}>{psicologa.nome}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{psicologa.abordagem}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{psicologa.crp}</p>
          </div>
        </div>
        <div style={{ padding: "14px 16px" }}>
          {[
            { label: "🧠 Tipo",      valor: tipo.nome },
            { label: "📅 Data",      valor: dia.dataCompleta },
            { label: "⏰ Horário",   valor: hora.hora },
            { label: "📍 Local",     valor: local },
            { label: "💳 Duração",   valor: "50 minutos" },
          ].map((row) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "9px 0", borderBottom: "0.5px solid #f3f4f6",
            }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{row.valor}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 12, background: "#EEEDFE",
        border: "0.5px solid #C4C0F0", borderRadius: 10,
        padding: "10px 12px", fontSize: 12, color: "#534AB7",
        lineHeight: 1.5,
      }}>
        💜 Você receberá a confirmação por e-mail. Cancelamentos devem ser feitos com 24h de antecedência.
      </div>

      <button
        onClick={onConfirmar}
        disabled={loading}
        style={{
          width: "100%", marginTop: 14, padding: "14px",
          borderRadius: 12, border: "none",
          background: loading ? "#9b92d4" : "#4A3F8F",
          color: "#fff", fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Agendando sessão..." : "✅ Confirmar sessão"}
      </button>
    </div>
  );
}

// ─── Tela de sucesso ──────────────────────────────────────────────────────────
function SuccessScreen({ psicologa, dia, hora, onNovo }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 24px", textAlign: "center",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "#EEEDFE", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 36, marginBottom: 20,
      }}>
        💜
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111827" }}>
        Sessão confirmada!
      </h2>
      <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
        Sua sessão com <strong>{psicologa.nome}</strong> foi agendada para{" "}
        <strong>{dia.dataCompleta}</strong> às <strong>{hora.hora}</strong>.
      </p>
      <div style={{
        background: "#f9fafb", borderRadius: 12,
        padding: "14px 20px", width: "100%", marginBottom: 24,
        border: "0.5px solid #e5e7eb",
      }}>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
          📲 Confirmação enviada para seu e-mail e celular.
        </p>
      </div>
      <button
        onClick={onNovo}
        style={{
          padding: "12px 28px", borderRadius: 10,
          border: "0.5px solid #4A3F8F", background: "transparent",
          color: "#4A3F8F", fontSize: 14, fontWeight: 500, cursor: "pointer",
        }}
      >
        Nova sessão
      </button>
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = {
  stepTitle: { fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 4px" },
  stepSub:   { fontSize: 13, color: "#6b7280", margin: 0 },
};

// ─── AgendamentoScreen principal ──────────────────────────────────────────────
export default function AgendamentoScreen({ navigation }) {
  const [step, setStep]           = useState(0);
  const [tipo, setTipo]           = useState(null);
  const [psicologa, setPsicologa] = useState(null);
  const [modalidade, setModalidade] = useState(null);
  const [dia, setDia]             = useState(null);
  const [hora, setHora]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [sucesso, setSucesso]     = useState(false);

  const podeAvancar = () => {
    if (step === 0) return !!tipo;
    if (step === 1) return !!psicologa;
    if (step === 2) return !!dia && !!hora;
    return true;
  };

  const avancar = () => { if (podeAvancar()) setStep((s) => Math.min(s + 1, 3)); };
  const voltar  = () => { if (step > 0) setStep((s) => s - 1); /* else navigation.goBack() */ };

  const confirmar = () => {
    setLoading(true);
    // Substituir por: await api.post('/sessoes', { tipo, psicologa, dia, hora, modalidade })
    setTimeout(() => { setLoading(false); setSucesso(true); }, 1800);
  };

  const resetar = () => {
    setStep(0); setTipo(null); setPsicologa(null);
    setModalidade(null); setDia(null); setHora(null);
    setLoading(false); setSucesso(false);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      maxWidth: 480, margin: "0 auto", overflow: "hidden",
    }}>
      {/* Topbar */}
      <div style={{
        background: "#fff", borderBottom: "0.5px solid #e5e7eb",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={voltar} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#374151", padding: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>Agendar sessão</p>
          {!sucesso && <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Passo {step + 1} de {STEPS.length}</p>}
        </div>
        <span style={{ fontSize: 20 }}>🧠</span>
      </div>

      {/* Step indicator */}
      {!sucesso && <StepIndicator currentStep={step} />}

      {/* Conteúdo */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
        {sucesso ? (
          <SuccessScreen psicologa={psicologa} dia={dia} hora={hora} onNovo={resetar} />
        ) : (
          <>
            {step === 0 && <StepTipo selected={tipo} onSelect={(t) => { setTipo(t); setPsicologa(null); }} />}
            {step === 1 && (
              <StepPsicologa
                tipo={tipo} selected={psicologa} modalidade={modalidade}
                onSelect={setPsicologa}
                onModalidade={(m) => { setModalidade((prev) => prev === m ? null : m); setPsicologa(null); }}
              />
            )}
            {step === 2 && (
              <StepDataHora
                dia={dia} hora={hora}
                onDia={(d) => { setDia(d); setHora(null); }}
                onHora={setHora}
              />
            )}
            {step === 3 && (
              <StepConfirmacao
                tipo={tipo} psicologa={psicologa} dia={dia} hora={hora}
                modalidade={modalidade} onConfirmar={confirmar} loading={loading}
              />
            )}
          </>
        )}
      </div>

      {/* Footer de navegação */}
      {!sucesso && step < 3 && (
        <div style={{
          padding: "12px 16px", background: "#fff",
          borderTop: "0.5px solid #e5e7eb", display: "flex", gap: 10,
        }}>
          {step > 0 && (
            <button onClick={voltar} style={{
              flex: 1, padding: "13px", borderRadius: 10,
              border: "0.5px solid #e5e7eb", background: "#fff",
              color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}>Voltar</button>
          )}
          <button
            onClick={avancar}
            disabled={!podeAvancar()}
            style={{
              flex: 2, padding: "13px", borderRadius: 10, border: "none",
              background: podeAvancar() ? "#4A3F8F" : "#e5e7eb",
              color: podeAvancar() ? "#fff" : "#9ca3af",
              fontSize: 14, fontWeight: 600,
              cursor: podeAvancar() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {step === 2 ? "Revisar →" : "Continuar →"}
          </button>
        </div>
      )}
    </div>
  );
}