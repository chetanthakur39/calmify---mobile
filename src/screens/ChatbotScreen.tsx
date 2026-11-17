import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { api } from "../api";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
};

const QUICK_TOPICS = [
  "How to stop panic attacks?",
  "4-7-8 Breathing technique",
  "Tips for work burnout",
  "Can't sleep tonight",
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I am your Calmify AI Stress Companion. How are you feeling right now? Feel free to ask about stress management, quick relaxation exercises, or dealing with anxiety.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const history = await api.getChatHistory();
        if (history && history.length > 0) {
          const loaded: Message[] = history.map((item, idx) => ({
            id: String(idx),
            sender: item.sender as "user" | "bot",
            text: item.message,
            time: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));
          setMessages(loaded);
        }
      } catch (e) {
        console.warn("Chat history fetch error:", e);
      }
    })();
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || sending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setSending(true);

    try {
      const res = await api.sendChatMessage(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.reply,
        time: new Date(res.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I am having a moment of turbulence connecting to the server. Take a slow, grounding breath while I reconnect.",
        time: "Now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.badge}>FEATURE 4: CONVERSATIONAL THERAPY</Text>
        <Text style={styles.title}>AI Stress Consultant</Text>
        <Text style={styles.subtitle}>
          24/7 empathetic assistant trained in Cognitive Behavioral Therapy (CBT) & somatic mindfulness.
        </Text>
      </View>

      {/* Quick Prompt Chips */}
      <View style={styles.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_TOPICS.map((topic, i) => (
            <TouchableOpacity
              key={i}
              style={styles.chip}
              onPress={() => handleSend(topic)}
            >
              <Text style={styles.chipText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m) => {
          const isBot = m.sender === "bot";
          return (
            <View
              key={m.id}
              style={[
                styles.messageBubble,
                isBot ? styles.botBubble : styles.userBubble,
              ]}
            >
              <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
                {m.text}
              </Text>
              <Text style={[styles.timeText, isBot ? styles.botTime : styles.userTime]}>
                {m.time}
              </Text>
            </View>
          );
        })}
        {sending && (
          <View style={[styles.messageBubble, styles.botBubble, { flexDirection: "row", alignItems: "center" }]}>
            <ActivityIndicator size="small" color="#0D9488" />
            <Text style={[styles.botText, { marginLeft: 8 }]}>Typing guidance...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask anything about stress, sleep, or breathing..."
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || sending) && styles.sendDisabled]}
          onPress={() => handleSend()}
          disabled={!input.trim() || sending}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#0284C7",
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  chipRow: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  chip: {
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    color: "#0369A1",
    fontWeight: "600",
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0284C7",
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: "#1E293B",
  },
  userText: {
    color: "#FFFFFF",
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
  },
  botTime: {
    color: "#94A3B8",
    textAlign: "left",
  },
  userTime: {
    color: "#BAE6FD",
    textAlign: "right",
  },
  inputBar: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0284C7",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
