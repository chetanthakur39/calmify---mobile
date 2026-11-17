import React, { useState } from "react";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useAuth } from "../auth";

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password || (isRegister && !name.trim())) {
      Alert.alert("Missing details", "Please fill in all fields.");
      return;
    }
    setBusy(true);
    try {
      if (isRegister) await signUp(name.trim(), email.trim(), password);
      else await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert("Could not continue", e.message === "UNAUTHORIZED" ? "Invalid email or password." : e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={s.title}>Calmify</Text>
      <Text style={s.subtitle}>Your daily mental wellness companion</Text>

      {isRegister && (
        <TextInput style={s.input} placeholder="Name" value={name} onChangeText={setName} />
      )}
      <TextInput
        style={s.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail}
      />
      <TextInput
        style={s.input} placeholder="Password" secureTextEntry
        value={password} onChangeText={setPassword}
      />

      <TouchableOpacity style={s.button} onPress={submit} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>{isRegister ? "Create account" : "Log in"}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister((v) => !v)}>
        <Text style={s.link}>{isRegister ? "Already have an account? Log in" : "New here? Create an account"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F4F8F6" },
  title: { fontSize: 34, fontWeight: "700", color: "#2F6F5E", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#5B6B66", marginBottom: 28, marginTop: 4 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#DCE5E1" },
  button: { backgroundColor: "#2F6F5E", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { textAlign: "center", color: "#2F6F5E", marginTop: 18 },
});
