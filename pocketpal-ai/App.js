import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { initLlama, LlamaContext } from "llama.rn";

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // AI State Management
  const [llamaContext, setLlamaContext] = useState<LlamaContext | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("Hi! 👋 How can I help you today?");
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize Local Model on Startup
  useEffect(() => {
    async function loadModel() {
      try {
        setIsInitializing(true);
        // Path to your local GGUF model on the device
        const modelPath = "/sdcard/Download/qwen2.5-0.5b-instruct-q4_k_m.gguf";
        const context = await initLlama({
          model: modelPath,
          n_ctx: 2048,
          n_threads: 4,
        });
        setLlamaContext(context);
      } catch (error) {
        console.error("Failed to load local model:", error);
      } finally {
        setIsInitializing(false);
      }
    }
    loadModel();
  }, []);

  // Send Prompt to Local LLM
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !llamaContext || isGenerating) return;

    const userPrompt = inputMessage;
    setInputMessage("");
    setAiResponse("Thinking...");
    setIsGenerating(true);

    try {
      const { text } = await llamaContext.completion({
        prompt: `<|im_start|>user\n${userPrompt}<|im_end|>\n<|im_start|>assistant\n`,
        n_predict: 256,
        stop: ["<|im_end|>", "<|endoftext|>"],
      });
      setAiResponse(text.trim());
    } catch (error) {
      setAiResponse("Error generating response from local model.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // ==================================================
  // WELCOME SCREEN
  // ==================================================
  if (screen === "welcome") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeScreen}>
          <View style={styles.centerContent}>
            <Text style={styles.logo}>proGrad</Text>
            <Text style={styles.tagline}>Plan. Learn. Achieve.</Text>
            <Text style={styles.tagline}>Graduate with purpose.</Text>
          </View>

          <Pressable
            style={styles.proceedButton}
            onPress={() => setScreen("login")}
          >
            <Text style={styles.proceedText}>Proceed</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==================================================
  // DASHBOARD SCREEN
  // ==================================================
  if (screen === "dashboard") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboard}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.menuIcon}>☰</Text>
            <Text style={styles.dashboardLogo}>proGrad</Text>
            <Text style={styles.notificationIcon}>🔔</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.dashboardContent}
          >
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.dashboardSubtitle}>
              Stay focused and keep pushing forward.
            </Text>

            {/* CALENDAR */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Calendar</Text>
              <Text style={styles.month}>August 2026</Text>
              <View style={styles.calendarDays}>
                <Text style={styles.day}>M</Text>
                <Text style={styles.day}>T</Text>
                <Text style={styles.day}>W</Text>
                <Text style={styles.day}>T</Text>
                <Text style={styles.day}>F</Text>
                <Text style={styles.day}>S</Text>
                <Text style={styles.day}>S</Text>
              </View>

              <View style={styles.calendarNumbers}>
                {[
                  " ", " ", " ", " ", " ", "1", "2", "3", "4", "5", "6", "7", "8",
                  "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                  "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31",
                ].map((number, index) => (
                  <View
                    key={index}
                    style={[
                      styles.calendarNumber,
                      number === "27" && styles.selectedDay,
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        number === "27" && styles.selectedNumber,
                      ]}
                    >
                      {number}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* UPCOMING TASK */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Upcoming</Text>
              <View style={styles.task}>
                <View style={styles.taskDot} />
                <View style={styles.taskInformation}>
                  <Text style={styles.taskTitle}>Study Data Structures</Text>
                  <Text style={styles.taskTime}>10:00 AM - 11:30 AM</Text>
                </View>
              </View>
            </View>

            {/* WIRED AI ASSISTANT */}
            <View style={styles.chatCard}>
              <View style={styles.chatHeader}>
                <Text style={styles.robot}>🤖</Text>
                <Text style={styles.chatTitle}>proGrad Assistant</Text>
                {isInitializing && (
                  <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />
                )}
              </View>

              <Text style={styles.aiMessage}>{aiResponse}</Text>

              <View style={styles.chatInput}>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="Ask proGrad anything..."
                  placeholderTextColor="#666"
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  onSubmitEditing={handleSendMessage}
                />
                <Pressable onPress={handleSendMessage} disabled={isGenerating}>
                  <Text style={styles.send}>➤</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* BOTTOM NAVIGATION */}
          <View style={styles.bottomNavigation}>
            <View style={styles.navigationItem}>
              <Text style={styles.navigationIcon}>⌂</Text>
              <Text style={styles.navigationText}>Home</Text>
            </View>
            <View style={styles.navigationItem}>
              <Text style={styles.navigationIcon}>□</Text>
              <Text style={styles.navigationText}>Calendar</Text>
            </View>
            <View style={styles.navigationItem}>
              <Text style={styles.navigationIcon}>✓</Text>
              <Text style={styles.navigationText}>Tasks</Text>
            </View>
            <View style={styles.navigationItem}>
              <Text style={styles.navigationIcon}>◯</Text>
              <Text style={styles.navigationText}>Chat</Text>
            </View>
            <View style={styles.navigationItem}>
              <Text style={styles.navigationIcon}>○</Text>
              <Text style={styles.navigationText}>Profile</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==================================================
  // LOGIN / SIGN UP SCREEN
  // ==================================================
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.authScreen}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => setScreen("welcome")}>
          <Text style={styles.backButton}>‹</Text>
        </Pressable>

        <View style={styles.authHeader}>
          <Text style={styles.authTitle}>
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </Text>
          <Text style={styles.authSubtitle}>
            {authMode === "login"
              ? "Login to continue your journey\nwith proGrad."
              : "Sign up to start your journey\nwith proGrad."}
          </Text>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, authMode === "login" && styles.activeTab]}
            onPress={() => setAuthMode("login")}
          >
            <Text
              style={[
                styles.tabText,
                authMode === "login" && styles.activeTabText,
              ]}
            >
              Login
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, authMode === "signup" && styles.activeTab]}
            onPress={() => setAuthMode("signup")}
          >
            <Text
              style={[
                styles.tabText,
                authMode === "signup" && styles.activeTabText,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {authMode === "login" && (
          <Pressable>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("dashboard")}
        >
          <Text style={styles.primaryButtonText}>
            {authMode === "login" ? "Login" : "Create Account"}
          </Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <Pressable style={styles.googleButton}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.accountSwitch}>
          <Text style={styles.accountText}>
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
          </Text>
          <Pressable
            onPress={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            <Text style={styles.signUpText}>
              {authMode === "login" ? "Sign Up" : "Login"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  welcomeScreen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 40,
    paddingBottom: 35,
    justifyContent: "space-between",
  },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { color: "#fff", fontSize: 54, fontWeight: "600", letterSpacing: -2, marginBottom: 25 },
  tagline: { color: "#fff", fontSize: 16, marginBottom: 6 },
  proceedButton: {
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  proceedText: { color: "#000", fontSize: 18, fontWeight: "600" },
  arrow: { color: "#000", fontSize: 28, marginLeft: 70 },
  authScreen: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 50 },
  backButton: { color: "#fff", fontSize: 42, fontWeight: "200" },
  authHeader: { marginTop: 40, marginBottom: 35 },
  authTitle: { color: "#fff", fontSize: 34, fontWeight: "600" },
  authSubtitle: { color: "#aaa", fontSize: 16, lineHeight: 25, marginTop: 10 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#333", marginBottom: 30 },
  tab: { flex: 1, alignItems: "center", paddingBottom: 15 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#fff" },
  tabText: { color: "#777", fontSize: 17 },
  activeTabText: { color: "#fff" },
  inputLabel: { color: "#fff", fontSize: 15, marginBottom: 10, marginTop: 15 },
  input: {
    height: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#292929",
    backgroundColor: "#111",
    color: "#fff",
    paddingHorizontal: 18,
    fontSize: 15,
  },
  forgotPassword: { color: "#bbb", textAlign: "right", marginTop: 15 },
  primaryButton: {
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  primaryButtonText: { color: "#000", fontSize: 17, fontWeight: "600" },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 25 },
  divider: { flex: 1, height: 1, backgroundColor: "#292929" },
  orText: { color: "#888", marginHorizontal: 15 },
  googleButton: {
    height: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: { color: "#fff", fontSize: 20, fontWeight: "bold", marginRight: 12 },
  googleText: { color: "#fff", fontSize: 16 },
  accountSwitch: { flexDirection: "row", justifyContent: "center", marginTop: 35 },
  accountText: { color: "#777" },
  signUpText: { color: "#fff", fontWeight: "600" },
  dashboard: { flex: 1, backgroundColor: "#000" },
  dashboardHeader: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuIcon: { color: "#fff", fontSize: 27 },
  dashboardLogo: { color: "#fff", fontSize: 22, fontWeight: "600" },
  notificationIcon: { fontSize: 20 },
  dashboardContent: { paddingHorizontal: 20, paddingBottom: 110 },
  greeting: { color: "#fff", fontSize: 32, fontWeight: "600", marginTop: 20 },
  dashboardSubtitle: { color: "#999", fontSize: 15, marginTop: 8, marginBottom: 25 },
  card: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
  },
  cardTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
  month: { color: "#aaa", fontSize: 14, marginTop: 10, marginBottom: 20 },
  calendarDays: { flexDirection: "row", justifyContent: "space-between" },
  day: { color: "#777", width: "14%", textAlign: "center" },
  calendarNumbers: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  calendarNumber: { width: "14.28%", height: 40, alignItems: "center", justifyContent: "center" },
  numberText: { color: "#fff" },
  selectedDay: { backgroundColor: "#fff", borderRadius: 20 },
  selectedNumber: { color: "#000", fontWeight: "600" },
  task: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  taskDot: { width: 9, height: 9, backgroundColor: "#fff", borderRadius: 10, marginRight: 12 },
  taskInformation: { flex: 1 },
  taskTitle: { color: "#fff", fontSize: 15 },
  taskTime: { color: "#777", fontSize: 13, marginTop: 6 },
  chatCard: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
  },
  chatHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  robot: { fontSize: 22, marginRight: 10 },
  chatTitle: { color: "#fff", fontSize: 17, fontWeight: "600" },
  aiMessage: {
    color: "#fff",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    lineHeight: 22,
  },
  chatInput: {
    height: 55,
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    marginTop: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInputStyle: { flex: 1, color: "#fff", paddingRight: 10 },
  send: { color: "#fff", fontSize: 20 },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: "#080808",
    borderTopWidth: 1,
    borderTopColor: "#222",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navigationItem: { alignItems: "center" },
  navigationIcon: { color: "#fff", fontSize: 21 },
  navigationText: { color: "#777", fontSize: 10, marginTop: 4 },
});