import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api, MoodEntry } from "../api";
import { useAuth } from "../auth";

const EMOJI: Record<number, string> = { 1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" };

export default function HistoryScreen() {
  const { signOut } = useAuth();
  const [items, setItems] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getMoods();
      setItems([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e: any) {
      if (e.message === "UNAUTHORIZED") await signOut();
      else setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [signOut]);

  // Reload every time the tab gains focus so new check-ins show up.
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  const avg = items.length ? items.reduce((sum, m) => sum + m.mood, 0) / items.length : 0;

  return (
    <FlatList
      style={s.list}
      data={items}
      keyExtractor={(m) => String(m.id)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      ListHeaderComponent={
        <View style={s.summary}>
          <Text style={s.summaryTitle}>Average mood</Text>
          <Text style={s.summaryValue}>{items.length ? `${avg.toFixed(1)} / 5` : "–"}</Text>
          {error && <Text style={s.error}>{error}</Text>}
        </View>
      }
      ListEmptyComponent={<Text style={s.empty}>No check-ins yet. Add your first one!</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <Text style={s.cardEmoji}>{EMOJI[item.mood] ?? "🙂"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            {!!item.note && <Text style={s.note}>{item.note}</Text>}
          </View>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  list: { backgroundColor: "#F4F8F6" },
  summary: { padding: 20, alignItems: "center" },
  summaryTitle: { color: "#5B6B66" },
  summaryValue: { fontSize: 30, fontWeight: "700", color: "#2F6F5E" },
  error: { color: "#B3473F", marginTop: 8 },
  empty: { textAlign: "center", color: "#5B6B66", marginTop: 40 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 10, padding: 14, borderRadius: 12 },
  cardEmoji: { fontSize: 30, marginRight: 14 },
  date: { color: "#5B6B66", fontSize: 12 },
  note: { marginTop: 4, color: "#24312D" },
});
