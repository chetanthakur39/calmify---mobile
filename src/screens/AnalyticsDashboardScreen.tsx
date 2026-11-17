import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { api, AnalyticsDashboard } from "../api";

export default function AnalyticsDashboardScreen() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalyticsDashboard();
      setData(res);
    } catch (e) {
      console.warn("Analytics fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDashboard(); }} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.badge}>FEATURE 3: MONTHLY & WEEKLY INTELLIGENCE</Text>
        <Text style={styles.title}>Stress & Mood Analytics</Text>
        <Text style={styles.subtitle}>
          AI correlates your daily check-ins and facial scans to show monthly trends, highs, and lows.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
      ) : data ? (
        <>
          {/* Key Metric Highlights */}
          <View style={styles.grid}>
            <View style={[styles.card, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
              <Text style={styles.cardLabel}>Average Mood</Text>
              <Text style={[styles.cardValue, { color: "#065F46" }]}>{data.summary.avgMood} / 5</Text>
              <Text style={styles.cardSub}>Consistent Balance</Text>
            </View>

            <View style={[styles.card, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
              <Text style={styles.cardLabel}>Average Stress</Text>
              <Text style={[styles.cardValue, { color: "#1E40AF" }]}>{data.summary.avgStress}%</Text>
              <Text style={styles.cardSub}>Healthy Baseline</Text>
            </View>

            <View style={[styles.card, { backgroundColor: "#FAF5FF", borderColor: "#E9D5FF" }]}>
              <Text style={styles.cardLabel}>Monthly High</Text>
              <Text style={[styles.cardValue, { color: "#6B21A8" }]}>{data.summary.highestMood} ★</Text>
              <Text style={styles.cardSub}>Peak Wellness</Text>
            </View>

            <View style={[styles.card, { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" }]}>
              <Text style={styles.cardLabel}>Monthly Low</Text>
              <Text style={[styles.cardValue, { color: "#9A3412" }]}>{data.summary.lowestMood} ★</Text>
              <Text style={styles.cardSub}>Reset Target</Text>
            </View>
          </View>

          {/* AI Personalized Recommendation Card */}
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiBadge}>🤖 AI Wellness Coach</Text>
            </View>
            <Text style={styles.aiMessage}>{data.summary.aiSuggestion}</Text>
          </View>

          {/* Monthly Trend Indicator */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>30-Day Emotional Highs & Lows</Text>
            <View style={styles.chartBarContainer}>
              {[5, 4, 3, 5, 4, 2, 4, 5, 3, 4, 5, 4].map((score, i) => (
                <View key={i} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: score * 16,
                        backgroundColor: score >= 4 ? "#10B981" : score === 3 ? "#FBBF24" : "#F87171",
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{i + 1}</Text>
                </View>
              ))}
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.legendText}>High Mood (4-5)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#FBBF24" }]} />
                <Text style={styles.legendText}>Moderate (3)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#F87171" }]} />
                <Text style={styles.legendText}>Low / Recovery (1-2)</Text>
              </View>
            </View>
          </View>

          {/* Weekly Report Summary */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Weekly Summary Breakdown</Text>
            <Text style={styles.summaryText}>
              • Active Days Tracked: {data.summary.totalEntries} entries recorded this month.
            </Text>
            <Text style={styles.summaryText}>
              • Current Mindfulness Streak: {data.summary.streakDays} consecutive days.
            </Text>
            <Text style={styles.summaryText}>
              • Best Stress Reduction Window: 8:00 AM - 10:00 AM after morning yoga practice.
            </Text>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4F46E5",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 4,
  },
  cardSub: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  aiCard: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "#C7D2FE",
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
  },
  aiHeader: {
    marginBottom: 6,
  },
  aiBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4338CA",
  },
  aiMessage: {
    fontSize: 13,
    color: "#3730A3",
    lineHeight: 20,
    fontWeight: "500",
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },
  chartBarContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 90,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  barWrapper: {
    alignItems: "center",
  },
  bar: {
    width: 14,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: "#64748B",
  },
  summaryText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 4,
  },
});
