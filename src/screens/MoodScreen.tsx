import React, { useState } from "react";
import {
  ActivityIndicator, Alert, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { api } from "../api";
import { useAuth } from "../auth";

const MOODS = [
  { value: 1, emoji: "😞", label: "Low" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

export default function MoodScreen() {
  const { signOut } = useAuth();
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (selected === null) {
      Alert.alert("Pick a mood", "Select how you feel today.");
      return;
    }
    setBusy(true);
    try {
      await api.addMood(selected, note.trim());
      setSelected(null);
      setNote("");
      Alert.alert("Saved", "Your mood check-in has been recorded.");
    } catch (e: any) {
      if (e.message === "UNAUTHORIZED") await signOut();
      else Alert.alert("Could not save", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.heading}>How are you feeling today?</Text>
      <View style={s.row}>
        {MOODS.map((m) => (
          <TouchableOpacity
            key={m.value}
            style={[s.moodBtn, selected === m.value && s.moodSelected]}
            onPress={() => setSelected(m.value)}
          >
            <Text style={s.emoji}>{m.emoji}</Text>
            <Text style={s.moodLabel}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={s.note} placeholder="Add a note (optional)" multiline
        value={note} onChangeText={setNote}
      />

      <TouchableOpacity style={s.button} onPress={save} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Save check-in</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={signOut}>
        <Text style={s.logout}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F4F8F6", flexGrow: 1 },
  heading: { fontSize: 22, fontWeight: "700", color: "#2F6F5E", marginVertical: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  moodBtn: { alignItems: "center", padding: 8, borderRadius: 12, borderWidth: 2, borderColor: "transparent", width: 62 },
  moodSelected: { borderColor: "#2F6F5E", backgroundColor: "#E3F1EC" },
  emoji: { fontSize: 30 },
  moodLabel: { fontSize: 12, color: "#5B6B66", marginTop: 4 },
  note: { backgroundColor: "#fff", borderRadius: 10, padding: 14, minHeight: 100, textAlignVertical: "top", borderWidth: 1, borderColor: "#DCE5E1" },
  button: { backgroundColor: "#2F6F5E", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  logout: { textAlign: "center", color: "#B3473F", marginTop: 28 },
});
