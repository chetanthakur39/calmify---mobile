import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Live Production URL vs Localhost URL
// When deployed on Render / Railway / Heroku, swap this to your live URL
export const BASE_URL = Platform.select({
  web: "http://localhost:5000",
  android: "http://10.0.2.2:5000",
  default: "http://localhost:5000"
});

const TOKEN_KEY = "calmify_jwt_token";

export type MoodEntry = {
  id: number;
  mood: number; // 1 (very low) .. 5 (great)
  note?: string;
  createdAt: string;
};

export type StressScan = {
  id: number;
  stress_score: number;
  expression: string;
  heart_rate_est: number;
  recommendation: string;
  created_at: string;
};

export type YogaSession = {
  id: number;
  pose_name: string;
  efficiency: number;
  feedback: string;
  created_at: string;
};

export type AnalyticsDashboard = {
  summary: {
    avgMood: number;
    avgStress: number;
    highestMood: number;
    lowestMood: number;
    totalEntries: number;
    streakDays: number;
    aiSuggestion: string;
  };
  recentMoods: { mood: number; created_at: string }[];
  recentStress: { stress_score: number; created_at: string }[];
};

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  distance: string;
  phone: string;
  address: string;
  mapsQuery: string;
};

export async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}, auth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; name: string; email: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false),

  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: { id: number; name: string; email: string } }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }, false),

  getMe: () => request<{ user: { id: number; name: string; email: string } }>("/api/auth/me"),

  // Mood Tracker
  getMoods: () => request<MoodEntry[]>("/api/mood"),
  addMood: (mood: number, note: string) =>
    request<MoodEntry>("/api/mood", {
      method: "POST",
      body: JSON.stringify({ mood, note }),
    }),

  // Feature 1: Facial Stress Detection
  logStressScan: (data: { stressScore: number; expression: string; heartRateEst: number; recommendation: string }) =>
    request<{ message: string; id: number }>("/api/stress/scan", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getRecentStressScans: () => request<StressScan[]>("/api/stress/recent"),

  // Feature 2: Yoga Pose Checker
  saveYogaSession: (data: { poseName: string; efficiency: number; feedback: string }) =>
    request<YogaSession>("/api/yoga/session", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getYogaHistory: () => request<YogaSession[]>("/api/yoga/history"),

  // Feature 3: Analytics Dashboard
  getAnalyticsDashboard: () => request<AnalyticsDashboard>("/api/analytics/dashboard"),

  // Feature 4: AI Chatbot
  sendChatMessage: (message: string) =>
    request<{ reply: string; timestamp: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  getChatHistory: () => request<{ sender: string; message: string; timestamp: string }[]>("/api/chat/history"),

  // Feature 5: Doctors Directory
  getDoctors: () => request<Doctor[]>("/api/doctors", {}, false),
};
