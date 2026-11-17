import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { api, Doctor } from "../api";

export default function DoctorsAndGamesScreen() {
  const [activeTab, setActiveTab] = useState<"doctors" | "game">("doctors");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bubbles, setBubbles] = useState([
    { id: 1, text: "Stress", popped: false },
    { id: 2, text: "Overthinking", popped: false },
    { id: 3, text: "Fatigue", popped: false },
    { id: 4, text: "Anxiety", popped: false },
    { id: 5, text: "Deadlines", popped: false },
    { id: 6, text: "Self-Doubt", popped: false },
    { id: 7, text: "Tension", popped: false },
    { id: 8, text: "Insomnia", popped: false },
  ]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.getDoctors();
        setDoctors(list);
      } catch (e) {
        console.warn("Doctors fetch error:", e);
      }
    })();
  }, []);

  const openGoogleMaps = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  const callDoctor = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`);
  };

  const popBubble = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setScore((s) => s + 10);
  };

  const resetGame = () => {
    setBubbles((prev) => prev.map((b) => ({ ...b, popped: false })));
    setScore(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>FEATURE 5: HEALTHCARE MAPS & MINDFUL GAMES</Text>
        <Text style={styles.title}>Doctors & Zen Playground</Text>
        <Text style={styles.subtitle}>
          Connect with nearby mental wellness specialists on Google Maps, or decompress with our tactile mind game.
        </Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segButton, activeTab === "doctors" && styles.segActive]}
          onPress={() => setActiveTab("doctors")}
        >
          <Text style={[styles.segText, activeTab === "doctors" && styles.segActiveText]}>
            📍 Nearest Doctors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segButton, activeTab === "game" && styles.segActive]}
          onPress={() => setActiveTab("game")}
        >
          <Text style={[styles.segText, activeTab === "game" && styles.segActiveText]}>
            🎮 Zen Bubble Pop
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "doctors" ? (
        <View style={styles.tabContent}>
          {doctors.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                  <Text style={styles.docClinic}>🏥 {doc.clinic}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {doc.rating}</Text>
                </View>
              </View>

              <Text style={styles.docAddress}>📍 {doc.address} • {doc.distance}</Text>

              <View style={styles.docActions}>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => openGoogleMaps(doc.mapsQuery)}
                >
                  <Text style={styles.mapButtonText}>🗺️ Open Google Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => callDoctor(doc.phone)}
                >
                  <Text style={styles.callButtonText}>📞 Call Clinic</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.gameContainer}>
          <View style={styles.gameHeader}>
            <Text style={styles.gameTitle}>✨ Pop the Stress Bubbles</Text>
            <Text style={styles.gameScore}>Zen Points: {score}</Text>
          </View>
          <Text style={styles.gameSubtitle}>
            Tap each stress trigger to pop and dissolve it from your mind.
          </Text>

          <View style={styles.bubbleGrid}>
            {bubbles.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.bubble, b.popped && styles.bubblePopped]}
                onPress={() => !b.popped && popBubble(b.id)}
                disabled={b.popped}
              >
                <Text style={[styles.bubbleText, b.popped && styles.bubbleTextPopped]}>
                  {b.popped ? "💨 Calm" : `🫧 ${b.text}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>🔄 Reset All Bubbles</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7C3AED",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  segButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  segActive: {
    backgroundColor: "#7C3AED",
  },
  segText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  segActiveText: {
    color: "#FFF",
  },
  tabContent: {
    gap: 14,
  },
  docCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  docTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  docName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  docSpecialty: {
    fontSize: 13,
    color: "#7C3AED",
    fontWeight: "600",
    marginTop: 2,
  },
  docClinic: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    height: 26,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B45309",
  },
  docAddress: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 10,
    marginBottom: 12,
  },
  docActions: {
    flexDirection: "row",
    gap: 10,
  },
  mapButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  callButton: {
    flex: 1,
    backgroundColor: "#EDE9FE",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  callButtonText: {
    color: "#6D28D9",
    fontSize: 12,
    fontWeight: "700",
  },
  gameContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  gameScore: {
    fontSize: 14,
    fontWeight: "800",
    color: "#7C3AED",
  },
  gameSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
  },
  bubbleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  bubble: {
    width: "48%",
    backgroundColor: "#F5F3FF",
    borderWidth: 1.5,
    borderColor: "#DDD6FE",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bubblePopped: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
    opacity: 0.6,
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6D28D9",
  },
  bubbleTextPopped: {
    color: "#94A3B8",
    fontWeight: "500",
  },
  resetButton: {
    marginTop: 18,
    backgroundColor: "#EDE9FE",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#6D28D9",
    fontSize: 13,
    fontWeight: "700",
  },
});
