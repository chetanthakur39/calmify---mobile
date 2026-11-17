import React from "react";
import { ActivityIndicator, View, TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/auth";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import MoodScreen from "./src/screens/MoodScreen";
import StressDetectionScreen from "./src/screens/StressDetectionScreen";
import YogaPoseScreen from "./src/screens/YogaPoseScreen";
import AnalyticsDashboardScreen from "./src/screens/AnalyticsDashboardScreen";
import ChatbotScreen from "./src/screens/ChatbotScreen";
import DoctorsAndGamesScreen from "./src/screens/DoctorsAndGamesScreen";

const Tab = createBottomTabNavigator();

function Root() {
  const { loading, signedIn, user, signOut } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  if (!signedIn) return <LoginScreen />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#0D9488",
          tabBarInactiveTintColor: "#64748B",
          tabBarStyle: {
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E2E8F0",
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={signOut}
              style={{ marginRight: 16, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#FEE2E2", borderRadius: 8 }}
            >
              <Text style={{ fontSize: 11, color: "#DC2626", fontWeight: "700" }}>Log Out</Text>
            </TouchableOpacity>
          ),
        }}
      >
        <Tab.Screen
          name="Mood Check"
          component={MoodScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🌿</Text>,
            headerTitle: `Hello, ${user?.name || "Friend"}`,
          }}
        />
        <Tab.Screen
          name="Facial Scan"
          component={StressDetectionScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📷</Text>,
            headerTitle: "Facial Stress Detection",
          }}
        />
        <Tab.Screen
          name="Yoga AI"
          component={YogaPoseScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🧘</Text>,
            headerTitle: "Yoga Pose Efficiency Checker",
          }}
        />
        <Tab.Screen
          name="Analytics"
          component={AnalyticsDashboardScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📊</Text>,
            headerTitle: "Monthly & Weekly Report",
          }}
        />
        <Tab.Screen
          name="AI Coach"
          component={ChatbotScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💬</Text>,
            headerTitle: "Calmify AI Assistant",
          }}
        />
        <Tab.Screen
          name="Doctors & Game"
          component={DoctorsAndGamesScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🗺️</Text>,
            headerTitle: "Doctors & Relaxation",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Root />
    </AuthProvider>
  );
}
