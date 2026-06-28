import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";

// ─── Dados fictícios ──────────────────────────────────────────────────────────

const TIPOS_SESSAO = [
  { id: 1, nome: "Terapia Individual",    icone: "🧠", descricao: "Sessão focada em você" },
  { id: 2, nome: "Terapia de Casal",      icone: "💑", descricao: "Para casais e relacionamentos" },
  { id: 3, nome: "Terapia Familiar",      icone: "👨‍👩‍👧", descricao: "Dinâmica e conflitos familiares" },
  { id: 4, nome: "Avaliação Psicológica", icone: "📋", descricao: "Laudos e relatórios clínicos" },
];



const MODALIDADES = [
  { id: "presencial", label: "Presencial", icon: "🏢" },
  { id: "online",     label: "Online",     icon: "💻" },
];

const HORAS_BASE = ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const OCUPADOS   = [1, 4, 7];
const HORAS      = HORAS_BASE.map((h, i) => ({ hora: h, disponivel: !OCUPADOS.includes(i) }));

function gerarDias() {
  const dias = [], nomes = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const hoje = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(hoje); d.setDate(hoje.getDate() + i);
    dias.push({
      id: i, diaSemana: nomes[d.getDay()], dia: d.getDate(),
      mes: meses[d.getMonth()],
      dataCompleta: d.toLocaleDateString("pt-BR"),
      desabilitado: d.getDay() === 0,
    });
  }
  return dias;
}
const DIAS  = gerarDias();
const STEPS = ["Tipo de sessão", "Psicóloga", "Data & Hora", "Confirmação"];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Avatar({ initials, size = 44, bgColor = "#EEEDFE", textColor = "#534AB7" }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.33, color: textColor }]}>{initials}</Text>
    </View>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  return (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, i) => (
        <React.Fragment key={i}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, i <= currentStep && styles.stepCircleActive]}>
              <Text style={[styles.stepNumber, i <= currentStep && styles.stepNumberActive]}>
                {i < currentStep ? "✓" : String(i + 1)}
              </Text>
            </View>
            <Text style={[styles.stepLabel, i <= currentStep && styles.stepLabelActive]} numberOfLines={1}>
              {step}
            </Text>
          </View>
          {i < STEPS.length - 1 && (
            <View style={[styles.stepLine, i < currentStep && styles.stepLineActive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── STEP 1: Tipo ─────────────────────────────────────────────────────────────

function StepTipo({ selected, onSelect }) {
  return (
    <View>
      <Text style={styles.stepTitle}>Que tipo de sessão você precisa?</Text>
      <Text style={styles.stepSub}>Selecione o formato que melhor se encaixa</Text>
      <View style={styles.tipoGrid}>
        {TIPOS_SESSAO.map((t) => {
          const sel = selected?.id === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              onPress={() => onSelect(t)}
              style={[styles.tipoCard, sel && styles.tipoCardSel]}
            >
              <Text style={styles.tipoIcone}>{t.icone}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tipoNome, sel && styles.tipoNomeSel]}>{t.nome}</Text>
                <Text style={styles.tipoDesc}>{t.descricao}</Text>
              </View>
              {sel && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── STEP 2: Psicóloga ────────────────────────────────────────────────────────

function StepPsicologa({
  tipo,
  selected,
  onSelect,
  psicologas
}) {
  const lista = psicologas || [];
  return (
    <View>
      <Text style={styles.stepTitle}>Escolha a psicóloga</Text>
      <Text style={styles.stepSub}>
        {lista.length} profissional(is) disponível(is)
      </Text>

      <View style={{ gap: 10 }}>
        {lista.map((p) => {
          const sel = selected?.id === p.id;
          const temMod = true;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => temMod && onSelect(p)}
              disabled={!temMod}
              style={[styles.psicCard, sel && styles.psicCardSel, !temMod && styles.psicCardDisabled]}
            >
              <View style={styles.psicHeader}>
                <Avatar
  initials={
    p.nome
      ?.split(" ")
      .map(n => n[0])
      .slice(0,2)
      .join("")
      .toUpperCase()
  } />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.psicNome}>{p.nome}</Text>
                  <Text style={styles.psicCrp}>Estagiário de Psicologia</Text>
                  <Text style={styles.psicAbordagem}>{p.abordagem}</Text>
                </View>
                {sel && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.psicBio}>Atendimento supervisionado pela clínica escola.</Text>
              <View style={styles.psicFooter}>
                <Text style={styles.psicAvaliacao}>Supervisor: {p.supervisor}</Text>
                <Text style={styles.psicSessoes}>
                  Sala: {p.sala_preferencial}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── STEP 3: Data & Hora ──────────────────────────────────────────────────────

function StepDataHora({ dia, hora, onDia, onHora }) {
  return (
    <View>
      <Text style={styles.stepTitle}>Data e horário</Text>
      <Text style={styles.stepSub}>Escolha quando você quer ser atendida</Text>

      {/* Calendário horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diasScroll}>
        {DIAS.map((d) => {
          const sel = dia?.id === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              onPress={() => !d.desabilitado && onDia(d)}
              disabled={d.desabilitado}
              style={[
                styles.diaBtn,
                sel && styles.diaBtnSel,
                d.desabilitado && styles.diaBtnDisabled,
              ]}
            >
              <Text style={[styles.diaSemana, sel && styles.diaTextSel, d.desabilitado && styles.diaTextDisabled]}>
                {d.diaSemana}
              </Text>
              <Text style={[styles.diaDia, sel && styles.diaTextSel, d.desabilitado && styles.diaTextDisabled]}>
                {d.dia}
              </Text>
              <Text style={[styles.diaMes, sel && styles.diaTextSel, d.desabilitado && styles.diaTextDisabled]}>
                {d.mes}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Horários */}
      {dia ? (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.horariosLabel}>Horários disponíveis — {dia.dataCompleta}</Text>
          <View style={styles.horariosGrid}>
            {HORAS.map((h) => {
              const sel = hora?.hora === h.hora;
              return (
                <TouchableOpacity
                  key={h.hora}
                  onPress={() => h.disponivel && onHora(h)}
                  disabled={!h.disponivel}
                  style={[
                    styles.horaBtn,
                    sel && styles.horaBtnSel,
                    !h.disponivel && styles.horaBtnDisabled,
                  ]}
                >
                  <Text style={[
                    styles.horaText,
                    sel && styles.horaTextSel,
                    !h.disponivel && styles.horaTextDisabled,
                  ]}>
                    {h.hora}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Legenda */}
          <View style={styles.legenda}>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaBox, { backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e5e7eb" }]} />
              <Text style={styles.legendaText}>Disponível</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaBox, { backgroundColor: "#f3f4f6" }]} />
              <Text style={styles.legendaText}>Ocupado</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaBox, { backgroundColor: "#4A3F8F" }]} />
              <Text style={styles.legendaText}>Selecionado</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.diaPlaceholder}>
          <Text style={styles.diaPlaceholderText}>👆 Selecione um dia para ver os horários</Text>
        </View>
      )}
    </View>
  );
}

// ─── STEP 4: Confirmação ──────────────────────────────────────────────────────

function StepConfirmacao({ tipo, psicologa, dia, hora, modalidade, onConfirmar, loading }) {
  const local = modalidade === "online"
    ? "Online (link enviado por e-mail)"
    : "Clínica MenteCuidada — Rua das Flores, 142";

  const rows = [
    ["🧠 Tipo",    tipo.nome],
    ["📅 Data",    dia.dataCompleta],
    ["⏰ Horário", hora.hora],
    ["📍 Local",   local],
    ["💳 Duração", "50 minutos"],
  ];

  return (
    <View>
      <Text style={styles.stepTitle}>Confirme sua sessão</Text>
      <Text style={styles.stepSub}>Revise os detalhes antes de confirmar</Text>

      {/* Card psicóloga */}
      <View style={styles.confirmCard}>
        <View style={styles.confirmHeader}>
          <Avatar
  initials={
    psicologa.nome
      ?.split(" ")
      .map(n => n[0])
      .slice(0,2)
      .join("")
      .toUpperCase()
  } />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.confirmNome}>{psicologa.nome}</Text>
            <Text style={styles.confirmAbordagem}>
              Supervisor: {psicologa.supervisor}
            </Text>
            <Text style={styles.confirmCrp}>
              Sala: {psicologa.sala_preferencial}
            </Text>
          </View>
        </View>
        <View style={styles.confirmRows}>
          {rows.map(([l, v]) => (
            <View key={l} style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>{l}</Text>
              <Text style={styles.confirmValue}>{v}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Aviso */}
      <View style={styles.avisoBox}>
        <Text style={styles.avisoText}>
          💜 Você receberá a confirmação por e-mail e SMS. Cancelamentos devem ser feitos com 24h de antecedência.
        </Text>
      </View>

      {/* Botão confirmar */}
      <TouchableOpacity
        style={[styles.btnConfirmar, loading && styles.btnConfirmarLoading]}
        onPress={onConfirmar}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnConfirmarText}>✅ Confirmar sessão</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

// ─── Tela de Sucesso ──────────────────────────────────────────────────────────

function SuccessScreen({ psicologa, dia, hora, onNovo }) {
  return (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Text style={{ fontSize: 44 }}>💜</Text>
      </View>
      <Text style={styles.successTitle}>Sessão confirmada!</Text>
      <Text style={styles.successText}>
        Sua sessão com <Text style={{ fontWeight: "700" }}>{psicologa.nome}</Text> foi agendada para{" "}
        <Text style={{ fontWeight: "700" }}>{dia.dataCompleta}</Text> às{" "}
        <Text style={{ fontWeight: "700" }}>{hora.hora}</Text>.
      </Text>
      <View style={styles.successInfo}>
        <Text style={styles.successInfoText}>
          📲 Confirmação enviada para seu e-mail e celular cadastrado.
        </Text>
      </View>
      <TouchableOpacity style={styles.btnNovo} onPress={onNovo}>
        <Text style={styles.btnNovoText}>Agendar nova sessão</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── AgendamentoScreen principal ──────────────────────────────────────────────

export default function AgendamentoScreen({ navigation }) {
  const [step, setStep]             = useState(0);
  const [tipo, setTipo]             = useState(null);
  const [psicologa, setPsicologa]   = useState(null);
  const [modalidade, setModalidade] = useState(null);
  const [dia, setDia]               = useState(null);
  const [hora, setHora]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [sucesso, setSucesso]       = useState(false);
  const [psicologasBanco, setPsicologasBanco] = useState([]);
        useEffect(() => {
      carregarEstagiarios();
    }, []);

  const podeAvancar = () => {
    if (step === 0) return !!tipo;
    if (step === 1) return !!psicologa;
    if (step === 2) return !!dia && !!hora;
    return true;
  };

  const avancar = () => { if (podeAvancar()) setStep((s) => Math.min(s + 1, 3)); };
  const voltar  = () => { if (step > 0) setStep((s) => s - 1); };

    async function carregarEstagiarios() {

  const { data, error } = await supabase
    .from("estagiarios")
    .select("*");

  if (!error) {
    setPsicologasBanco(data || []);
  }
}


const confirmar = async () => {

  setLoading(true);

  const { data, error } = await supabase
    .from("agendamentos")
    .insert([
      {
        paciente_id: global.usuarioLogado.paciente_id,
        estagiario_id: psicologa.id,
        tipo_sessao: tipo.nome,
        data_sessao: dia.dataCompleta.split("/").reverse().join("-"),
        horario: hora.hora,
        sala: psicologa.sala_preferencial,
        observacoes: ""
      }
    ])
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert(JSON.stringify(error));
    setLoading(false);
    return;
  }

  setLoading(false);
  setSucesso(true);
};

  const resetar = () => {
    setStep(0); setTipo(null); setPsicologa(null);
    setModalidade(null); setDia(null); setHora(null);
    setLoading(false); setSucesso(false);
  };

  const renderStep = () => {
    if (sucesso) return <SuccessScreen psicologa={psicologa} dia={dia} hora={hora} onNovo={resetar} />;
    switch (step) {
      case 0: return <StepTipo selected={tipo} onSelect={(t) => { setTipo(t); setPsicologa(null); }} />;
      case 1: return (
       <StepPsicologa
          tipo={tipo}
          selected={psicologa}
          psicologas={psicologasBanco}
          onSelect={setPsicologa}
        />
      );
      case 2: return <StepDataHora dia={dia} hora={hora} onDia={(d) => { setDia(d); setHora(null); }} onHora={setHora} />;
      case 3: return (
        <StepConfirmacao
          tipo={tipo} psicologa={psicologa} dia={dia} hora={hora}
          modalidade={modalidade} onConfirmar={confirmar} loading={loading}
        />
      );
      default: return null;
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={voltar} style={styles.topbarBack}>
          <Text style={styles.topbarBackText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.topbarTitle}>Agendar sessão</Text>
          {!sucesso && (
            <Text style={styles.topbarSub}>Passo {step + 1} de {STEPS.length}</Text>
          )}
        </View>
        <Text style={{ fontSize: 22 }}>🧠</Text>
      </View>

      {/* Step indicator */}
      {!sucesso && <StepIndicator currentStep={step} />}

      {/* Conteúdo */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Footer com botões */}
      {!sucesso && step < 3 && (
        <View style={styles.footer}>
          {step > 0 && (
            <TouchableOpacity onPress={voltar} style={styles.btnVoltar}>
              <Text style={styles.btnVoltarText}>Voltar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={avancar}
            disabled={!podeAvancar()}
            style={[styles.btnAvancar, !podeAvancar() && styles.btnAvancarDisabled]}
          >
            <Text style={styles.btnAvancarText}>
              {step === 2 ? "Revisar →" : "Continuar →"}
            </Text>
          </TouchableOpacity>
        </View>
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

  // Topbar
  topbar: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    padding: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topbarBack: {
    padding: 4,
  },
  topbarBackText: {
    fontSize: 22,
    color: "#374151",
  },
  topbarTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  topbarSub: {
    fontSize: 11,
    color: "#9ca3af",
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  stepItem: {
    alignItems: "center",
    gap: 4,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: "#4A3F8F",
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9ca3af",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 8,
    color: "#9ca3af",
    fontWeight: "400",
    maxWidth: 56,
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#4A3F8F",
    fontWeight: "600",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepLineActive: {
    backgroundColor: "#4A3F8F",
  },

  // Conteúdo
  content: {
    padding: 16,
    gap: 12,
  },

  // Títulos
  stepTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  stepSub: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16,
  },

  // Avatar
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "700",
  },

  // Tipo
  tipoGrid: {
    gap: 10,
  },
  tipoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  tipoCardSel: {
    borderWidth: 2,
    borderColor: "#4A3F8F",
    backgroundColor: "#EEEDFE",
  },
  tipoIcone: {
    fontSize: 28,
  },
  tipoNome: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  tipoNomeSel: {
    fontWeight: "700",
    color: "#4A3F8F",
  },
  tipoDesc: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4A3F8F",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
  },

  // Modalidade
  modalidadeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  modalidadeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  modalidadeBtnAtivo: {
    borderWidth: 2,
    borderColor: "#4A3F8F",
    backgroundColor: "#EEEDFE",
  },
  modalidadeIcon: {
    fontSize: 14,
  },
  modalidadeLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "400",
  },
  modalidadeLabelAtivo: {
    color: "#4A3F8F",
    fontWeight: "600",
  },

  // Psicóloga
  psicCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    padding: 14,
  },
  psicCardSel: {
    borderWidth: 2,
    borderColor: "#4A3F8F",
    backgroundColor: "#EEEDFE",
  },
  psicCardDisabled: {
    opacity: 0.5,
  },
  psicHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  psicNome: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  psicCrp: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 2,
  },
  psicAbordagem: {
    fontSize: 11,
    color: "#534AB7",
    fontWeight: "500",
    marginTop: 4,
  },
  psicBio: {
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 18,
    marginBottom: 10,
  },
  psicFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  psicAvaliacao: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
  },
  psicSessoes: {
    fontSize: 11,
    color: "#9ca3af",
  },
  psicModBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  psicModText: {
    fontSize: 9,
    color: "#6b7280",
  },

  // Data & Hora
  diasScroll: {
    marginBottom: 4,
  },
  diaBtn: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    marginRight: 8,
    minWidth: 50,
  },
  diaBtnSel: {
    backgroundColor: "#4A3F8F",
    borderColor: "#4A3F8F",
    borderWidth: 2,
  },
  diaBtnDisabled: {
    backgroundColor: "#f9fafb",
  },
  diaSemana: {
    fontSize: 9,
    fontWeight: "500",
    color: "#374151",
  },
  diaDia: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    lineHeight: 24,
  },
  diaMes: {
    fontSize: 8,
    color: "#9ca3af",
  },
  diaTextSel: {
    color: "#fff",
  },
  diaTextDisabled: {
    color: "#d1d5db",
  },
  horariosLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 10,
  },
  horariosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  horaBtn: {
    width: "18%",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  horaBtnSel: {
    backgroundColor: "#4A3F8F",
    borderColor: "#4A3F8F",
    borderWidth: 2,
  },
  horaBtnDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#f3f4f6",
  },
  horaText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#374151",
  },
  horaTextSel: {
    fontWeight: "700",
    color: "#fff",
  },
  horaTextDisabled: {
    color: "#d1d5db",
    textDecorationLine: "line-through",
  },
  legenda: {
    flexDirection: "row",
    gap: 14,
    marginTop: 12,
  },
  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendaBox: {
    width: 11,
    height: 11,
    borderRadius: 3,
  },
  legendaText: {
    fontSize: 11,
    color: "#9ca3af",
  },
  diaPlaceholder: {
    marginTop: 20,
    padding: 28,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  diaPlaceholderText: {
    fontSize: 13,
    color: "#9ca3af",
  },

  // Confirmação
  confirmCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 12,
  },
  confirmHeader: {
    backgroundColor: "#4A3F8F",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  confirmNome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  confirmAbordagem: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 3,
  },
  confirmCrp: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  confirmRows: {
    padding: 14,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  confirmLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  confirmValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
    textAlign: "right",
  },
  avisoBox: {
    backgroundColor: "#EEEDFE",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#C4C0F0",
    padding: 14,
    marginBottom: 16,
  },
  avisoText: {
    fontSize: 13,
    color: "#534AB7",
    lineHeight: 20,
  },
  btnConfirmar: {
    backgroundColor: "#4A3F8F",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnConfirmarLoading: {
    backgroundColor: "#9b92d4",
  },
  btnConfirmarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  // Sucesso
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEEDFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  successText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  successInfo: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    width: "100%",
  },
  successInfoText: {
    fontSize: 13,
    color: "#6b7280",
  },
  btnNovo: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#4A3F8F",
    backgroundColor: "transparent",
  },
  btnNovoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A3F8F",
  },

  // Footer
  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
  },
  btnVoltar: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  btnVoltarText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  btnAvancar: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#4A3F8F",
    alignItems: "center",
  },
  btnAvancarDisabled: {
    backgroundColor: "#e5e7eb",
  },
  btnAvancarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});