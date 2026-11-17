import * as SecureStore from "expo-secure-store";

// Change this to your Spring Boot backend.
// Android emulator -> http://10.0.2.2:8080 | physical phone -> http://<your-PC-LAN-IP>:8080
export const BASE_URL = "http://10.0.2.2:8080";

const TOKEN_KEY = "calmify_jwt";

export type MoodEntry = {
  id: number;
  mood: number; // 1 (very low) .. 5 (great)
  note?: string;
  createdAt: string;
};

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}
export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}
export async function clearToken() {
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
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as T;
}

// Adjust endpoint paths/field names to match your Calmify controllers.
export const api = {
  login: (email: string, password: string) =>
    request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false),
  register: (name: string, email: string, password: string) =>
    request<{ token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }, false),
  getMoods: () => request<MoodEntry[]>("/api/mood"),
  addMood: (mood: number, note: string) =>
    request<MoodEntry>("/api/mood", {
      method: "POST",
      body: JSON.stringify({ mood, note }),
    }),
};
