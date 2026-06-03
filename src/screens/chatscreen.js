import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// ─── Respostas pré-definidas ──────────────────────────────────────────────────

const RESPOSTAS = {
  saudacao: [
    "Olá! Fico feliz em poder conversar com você. Como posso te ajudar hoje? 🌸",
    "Oi! Seja bem-vindo(a). Estou aqui para te ouvir. O que você gostaria de conversar?",
  ],
  ansiedade: [
    "Entendo que a ansiedade pode ser muito desafiadora. Tente praticar a respiração 4-7-8: inspire por 4 segundos, segure por 7 e expire por 8. Isso ajuda a acalmar o sistema nervoso. 🌿",
    "A ansiedade é uma resposta natural do nosso corpo. Uma técnica simples é focar nos 5 sentidos: nomeie 5 coisas que você vê, 4 que pode tocar, 3 que ouve, 2 que cheira e 1 que saboreia.",
  ],
  tristeza: [
    "Sinto muito que você esteja se sentindo assim. É importante se permitir sentir, mas também se cuidar. Você tem dormido e se alimentado bem? 💜",
    "Obrigada por compartilhar isso comigo. Momentos difíceis fazem parte da vida. Lembre-se que você não precisa enfrentar isso sozinho(a) — estamos aqui para te apoiar.",
  ],
  estresse: [
    "O estresse do dia a dia pode ser muito pesado. Que tal reservar 10 minutos hoje só para você? Uma caminhada curta ou ouvir uma música favorita pode fazer diferença. 🎵",
    "Quando tudo parece demais, ajuda muito listar as prioridades e focar em uma coisa de cada vez. Você consegue identificar o que está te sobrecarregando mais?",
  ],
  sono: [
    "Dificuldades com o sono afetam muito nosso bem-estar. Tente evitar telas 1 hora antes de dormir e manter um horário regular. Um chá de camomila também pode ajudar! 🌙",
    "Uma boa rotina noturna faz grande diferença. Que tal criar um ritual de relaxamento? Pode ser uma leitura leve, meditação ou alongamento suave.",
  ],
  relacionamento: [
    "Relacionamentos podem ser fonte de alegria e também de desafios. A comunicação aberta e honesta é a base de qualquer relação saudável. Como você tem se sentido em relação a isso?",
    "É natural termos conflitos com pessoas que amamos. O importante é como resolvemos esses conflitos com respeito e empatia. Você gostaria de conversar mais sobre isso em uma sessão?",
  ],
  sessao: [
    "Ótima ideia! Você pode agendar uma sessão diretamente pelo app, na aba 'Agendar'. Sua psicóloga estará disponível para te ouvir com mais atenção. 📅",
    "Marcar uma sessão é um passo muito importante de autocuidado. Acesse a aba 'Agendar' para verificar os horários disponíveis.",
  ],
  agradecimento: [
    "Fico feliz em poder ajudar! Lembre-se que estou sempre aqui. Cuide-se! 🌸",
    "Obrigada por confiar em mim. Qualquer dúvida, pode falar à vontade!",
  ],
  padrao: [
    "Obrigada por compartilhar isso comigo. Cada pessoa é única e merece atenção especial. Você gostaria de agendar uma sessão para conversarmos com mais profundidade? 💜",
    "Entendo. É importante cuidar da saúde mental tanto quanto da física. Estou aqui para apoiar você nessa jornada.",
    "Isso que você está sentindo é válido. Que tal explorarmos isso melhor em uma sessão com sua psicóloga?",
  ],
};

const SUGESTOES = [
  { id: 1, texto: "Estou ansioso(a)" },
  { id: 2, texto: "Estou me sentindo triste" },
  { id: 3, texto: "Muito estressado(a)" },
  { id: 4, texto: "Tenho dificuldade para dormir" },
  { id: 5, texto: "Problemas no relacionamento" },
  { id: 6, texto: "Quero agendar uma sessão" },
];

// ─── Lógica do chatbot ────────────────────────────────────────────────────────

function gerarResposta(texto) {
  const t = texto.toLowerCase();

  if (t.match(/oi|olá|ola|bom dia|boa tarde|boa noite|tudo bem|como vai/)) {
    return sortear(RESPOSTAS.saudacao);
  }
  if (t.match(/ansied|ansios|nervos|panic|preocup/)) {
    return sortear(RESPOSTAS.ansiedade);
  }
  if (t.match(/trist|choran|chorando|depress|mal|péssim|pessim|vazio|vazia/)) {
    return sortear(RESPOSTAS.tristeza);
  }
  if (t.match(/estress|cansad|esgotad|sobrecarreg|pressão|pressao/)) {
    return sortear(RESPOSTAS.estresse);
  }
  if (t.match(/sono|dorm|insônia|insonia|acord/)) {
    return sortear(RESPOSTAS.sono);
  }
  if (t.match(/relacionament|namor|casament|família|familia|amigo|conflito/)) {
    return sortear(RESPOSTAS.relacionamento);
  }
  if (t.match(/agendar|sessão|sessao|consulta|horário|horario|marcar/)) {
    return sortear(RESPOSTAS.sessao);
  }
  if (t.match(/obrigad|valeu|thanks|grato|grata/)) {
    return sortear(RESPOSTAS.agradecimento);
  }

  return sortear(RESPOSTAS.padrao);
}

function sortear(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <View style={styles.typingWrapper}>
      <View style={styles.avatarSmall}>
        <Text style={styles.avatarSmallText}>RO</Text>
      </View>
      <View style={styles.typingBubble}>
        <Text style={styles.typingDots}>• • •</Text>
      </View>
    </View>
  );
}

function Mensagem({ msg }) {
  const isUser = msg.remetente === "user";
  return (
    <View style={[styles.msgWrapper, isUser && styles.msgWrapperUser]}>
      {!isUser && (
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarSmallText}>RO</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleBot,
        ]}
      >
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {msg.texto}
        </Text>
        <Text style={[styles.bubbleHora, isUser && styles.bubbleHoraUser]}>
          {msg.hora}
        </Text>
      </View>
    </View>
  );
}

// ─── ChatScreen principal ─────────────────────────────────────────────────────

export default function ChatScreen({ navigation }) {
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      remetente: "bot",
      texto:
        "Olá! Sou a assistente da Dra. Renata. Estou aqui para te apoiar entre as sessões. Como você está se sentindo hoje? 🌸",
      hora: horaAtual(),
    },
  ]);
  const [input, setInput] = useState("");
  const [digitando, setDigitando] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [mensagens, digitando]);

  function horaAtual() {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  function enviarMensagem(texto) {
    const t = texto.trim();
    if (!t) return;

    const novaMsgUser = {
      id: Date.now(),
      remetente: "user",
      texto: t,
      hora: horaAtual(),
    };

    setMensagens((prev) => [...prev, novaMsgUser]);
    setInput("");
    setDigitando(true);

    setTimeout(() => {
      const resposta = gerarResposta(t);
      setDigitando(false);
      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remetente: "bot",
          texto: resposta,
          hora: horaAtual(),
        },
      ]);
    }, 1200 + Math.random() * 600);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>RO</Text>
          </View>
          <View>
            <Text style={styles.headerNome}>Dra. Renata Oliveira</Text>
            <Text style={styles.headerStatus}>● Online agora</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Mensagens */}
        <ScrollView
          ref={scrollRef}
          style={styles.mensagensArea}
          contentContainerStyle={styles.mensagensContent}
          showsVerticalScrollIndicator={false}
        >
          {mensagens.map((m) => (
            <Mensagem key={m.id} msg={m} />
          ))}
          {digitando && <TypingIndicator />}
        </ScrollView>

        {/* Sugestões */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sugestoesContainer}
        >
          {SUGESTOES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.sugestaoBtn}
              onPress={() => enviarMensagem(s.texto)}
            >
              <Text style={styles.sugestaoText}>{s.texto}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={300}
            onSubmitEditing={() => enviarMensagem(input)}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !input.trim() && styles.sendBtnDisabled,
            ]}
            onPress={() => enviarMensagem(input)}
            disabled={!input.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    fontSize: 28,
    color: "#fff",
    lineHeight: 28,
    marginTop: -2,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  headerNome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  headerStatus: {
    fontSize: 11,
    color: "#A78BFA",
    marginTop: 2,
  },

  // Mensagens
  mensagensArea: {
    flex: 1,
  },
  mensagensContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 8,
  },
  msgWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  msgWrapperUser: {
    justifyContent: "flex-end",
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EEEDFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmallText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#534AB7",
  },
  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
  },
  bubbleBot: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: "#4A3F8F",
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    color: "#111827",
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: "#fff",
  },
  bubbleHora: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "right",
  },
  bubbleHoraUser: {
    color: "rgba(255,255,255,0.6)",
  },

  // Typing
  typingWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  typingBubble: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typingDots: {
    fontSize: 16,
    color: "#9ca3af",
    letterSpacing: 3,
  },

  // Sugestões
  sugestoesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sugestaoBtn: {
    backgroundColor: "#EEEDFE",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#C4C0F0",
  },
  sugestaoText: {
    fontSize: 12,
    color: "#4A3F8F",
    fontWeight: "500",
  },

  // Input
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#4A3F8F",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#e5e7eb",
  },
  sendIcon: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 2,
  },
});