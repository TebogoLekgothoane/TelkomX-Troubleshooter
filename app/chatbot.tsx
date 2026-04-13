
import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Message = {
  id: string;
  text: string;
  from: "bot" | "user";
};

type QueueItem = {
  id: string;
  ticketID: string;
  name: string;
  issue: string;
  category: string;
  department: string;
  diagnostics: string;
  status: string;
  priority: string;
  expectedWaitTime: number;
};

const departments = {
  Internet: "Technical Support",
  WiFi: "Technical Support",
  Billing: "Billing Department",
  Mobile: "Mobile Services",
  General: "Customer Service",
};

const commonIssues = [
  "slow internet",
  "no internet",
  "intermittent connection",
  "router issues",
  "wifi setup",
  "wifi password",
  "weak wifi",
  "wifi connection failed",
  "incorrect bill",
  "payment issues",
  "bill enquiry",
  "refund request",
  "mobile data issue",
  "call issues",
  "sms problems",
  "coverage issues",
  "outage",
  "call drops",
  "network disappeared",
];

const troubleshootingSteps: Record<string, string[]> = {
  "slow internet": [
    "Restart your router (unplug for 30 seconds, plug back in).",
    "Run a speed test at speedtest.net and note the results.",
    "Check for background downloads or updates consuming bandwidth.",
    "Try connecting via ethernet cable instead of WiFi.",
    "Move closer to the router or remove obstacles.",
  ],
  "no internet": [
    "Check all cable connections (power, ethernet, coax).",
    "Verify router lights: Power (solid), Internet (solid green), WiFi (solid).",
    "Restart modem first, wait 2 minutes, then restart router.",
    "Check for service outages in your area via our app or website.",
    "Reset router to factory settings if needed.",
  ],
  "outage": [
    "Checking community reports for outages...",
    "Verify if neighbors are affected.",
    "Use mobile data as backup.",
    "Monitor status on our website.",
    "Wait for resolution or escalate.",
  ],
  // Add more specific steps for other issues...
  default: [
    "Restart your device and router.",
    "Check connections and cables.",
    "Run diagnostics if available.",
    "Check for outages.",
    "Update device software.",
  ],
};

const quickReplies = ["Slow Internet", "No Connection", "Billing Inquiry", "Mobile Data Issue", "Call Problems", "Outage Check"];

const mockCommunityOutageCheck = async (issue: string): Promise<string> => {
  // Simulate API call to check community forums or X for outages
  // In real app, use fetch to an API endpoint that queries X or forums
  return new Promise((resolve) => {
    setTimeout(() => {
      if (issue.includes("outage") || issue.includes("no internet") || Math.random() > 0.7) {
        resolve("Based on recent community reports and forum posts, there appears to be a network outage in your area. Our teams are working on it. Estimated resolution: 2-4 hours.");
      } else {
        resolve("No widespread outages reported in community forums at this time.");
      }
    }, 1500);
  });
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [issueContext, setIssueContext] = useState({ attempt: 0, currentStep: 0, currentIssue: "" });
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [botTyping, setBotTyping] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState(false);
  const [chatDisabled, setChatDisabled] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Load saved chat
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem("chat_messages");
        const savedContext = await AsyncStorage.getItem("chat_issueContext");
        const savedQueue = await AsyncStorage.getItem("chat_queue");
        const savedChatDisabled = await AsyncStorage.getItem("chat_disabled");

        if (savedMessages) setMessages(JSON.parse(savedMessages));
        else
          setMessages([
            {
              id: "1",
              text: "Hello! I'm your TelkomX AI assistant. Based on recent community reports, common issues include slow internet, outages, and call drops. How can I help you today?",
              from: "bot",
            },
          ]);

        if (savedContext) setIssueContext(JSON.parse(savedContext));
        if (savedQueue) setQueue(JSON.parse(savedQueue));
        if (savedChatDisabled) setChatDisabled(JSON.parse(savedChatDisabled));
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };
    loadData();
  }, []);

  // Save chat to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem("chat_messages", JSON.stringify(messages));
    AsyncStorage.setItem("chat_issueContext", JSON.stringify(issueContext));
    AsyncStorage.setItem("chat_queue", JSON.stringify(queue));
    AsyncStorage.setItem("chat_disabled", JSON.stringify(chatDisabled));
  }, [messages, issueContext, queue, chatDisabled]);

  // Animate new messages
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [messages]);

  const animateButtonPress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const resetChat = async () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your TelkomX AI assistant. Based on recent community reports, common issues include slow internet, outages, and call drops. How can I help you today?",
        from: "bot",
      },
    ]);
    setIssueContext({ attempt: 0, currentStep: 0, currentIssue: "" });
    setQueue([]);
    setChatDisabled(false);
    setConfirmationMode(false);
    await AsyncStorage.multiRemove(["chat_messages", "chat_issueContext", "chat_queue", "chat_disabled"]);
  };

  const detectIssue = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    for (const issue of commonIssues) {
      if (lowerInput.includes(issue)) {
        return issue;
      }
    }
    return "";
  };

  const getDepartment = (issue: string): string => {
    if (issue.includes("internet") || issue.includes("wifi") || issue.includes("router") || issue.includes("outage")) {
      return "Technical Support";
    } else if (issue.includes("mobile") || issue.includes("data") || issue.includes("call") || issue.includes("sms") || issue.includes("coverage")) {
      return "Mobile Services";
    } else if (issue.includes("bill") || issue.includes("payment") || issue.includes("refund")) {
      return "Billing Department";
    }
    return "Customer Service";
  };

  const generateTicketID = (department: string): string => {
    let prefix = "CS";
    if (department === "Technical Support") prefix = "TECH";
    else if (department === "Billing Department") prefix = "BILL";
    else if (department === "Mobile Services") prefix = "MOB";
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "").slice(0, 6);
    const number = Math.floor(Math.random() * 9000 + 1000);
    return `${prefix}${date}${number}`;
  };

  const calculateWaitTime = (department: string): number => {
    if (department === "Technical Support") return Math.floor(Math.random() * 31 + 15);
    if (department === "Billing Department") return Math.floor(Math.random() * 21 + 10);
    if (department === "Mobile Services") return Math.floor(Math.random() * 21 + 20);
    return Math.floor(Math.random() * 26 + 25);
  };

  const getPriority = (issue: string): string => {
    if (issue.includes("no ") || issue.includes("outage") || issue.includes("disappeared") || issue.includes("drops")) return "High";
    if (issue.includes("bill") || issue.includes("payment")) return "Medium";
    return "Normal";
  };

  const escalateIssue = (issue: string, diagnostics: string) => {
    const department = getDepartment(issue);
    const ticketID = generateTicketID(department);
    const waitTime = calculateWaitTime(department);
    const priority = getPriority(issue);
    const newQueueItem: QueueItem = {
      id: Date.now().toString(),
      ticketID,
      name: "You",
      issue,
      category: issue.includes("internet") || issue.includes("wifi") ? "Internet" : issue.includes("mobile") || issue.includes("call") ? "Mobile" : "General",
      department,
      diagnostics,
      status: "Scheduled",
      priority,
      expectedWaitTime: waitTime,
    };
    setQueue((prev) => [...prev, newQueueItem]);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Issue escalated. Ticket: ${ticketID}, Department: ${department}, Priority: ${priority}, Expected Wait: ${waitTime} min. An agent will contact you shortly.`,
        from: "bot",
      },
    ]);
    setIssueContext({ attempt: 0, currentStep: 0, currentIssue: "" });
    setConfirmationMode(false);
    setChatDisabled(true);
  };

  const handleSend = () => {
    if (chatDisabled || !input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input.trim(), from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input.trim().toLowerCase();
    setInput("");

    setBotTyping(true);
    setTimeout(() => handleBotResponse(userInput), 1000);
  };

  const isYesResponse = (userInput: string): boolean => {
    const yesWords = ["yes", "yeah", "sure", "ok", "yep", "yes please"];
    return yesWords.some((word) => userInput.includes(word));
  };

  const isNoResponse = (userInput: string): boolean => {
    const noWords = ["no", "nah", "nope", "not yet", "no thanks"];
    return noWords.some((word) => userInput.includes(word));
  };

  const handleBotResponse = (userInput: string) => {
    setBotTyping(false);

    if (confirmationMode) {
      if (isYesResponse(userInput)) {
        escalateIssue(issueContext.currentIssue, "User confirmed escalation after troubleshooting attempts.");
      } else if (isNoResponse(userInput)) {
        const nextStepMsg = "Okay, let's try more troubleshooting. " + troubleshootingSteps[issueContext.currentIssue || "default"][issueContext.currentStep] || "Please provide more details.";
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: nextStepMsg, from: "bot" }]);
        setIssueContext((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
        if (issueContext.attempt >= 5) {
          escalateIssue(issueContext.currentIssue, "Auto-escalated after max attempts.");
        } else {
          setIssueContext((prev) => ({ ...prev, attempt: prev.attempt + 1 }),
          );
        }
      } else {
        const clarificationMsg = "I'm sorry, I didn't understand that. Did this resolve your issue? If not, would you like me to book you a slot with an agent? (Yes/No)";
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: clarificationMsg, from: "bot" }]);
        // Keep confirmationMode true
      }
      if (isYesResponse(userInput) || isNoResponse(userInput)) {
        setConfirmationMode(false);
      }
      return;
    }

    let detectedIssue = detectIssue(userInput);
    if (detectedIssue) {
      setIssueContext((prev) => ({ ...prev, currentIssue: detectedIssue }));
      const ackMsg = `I understand you're experiencing ${detectedIssue}. Here's a quick fix: `;
      const steps = troubleshootingSteps[detectedIssue] || troubleshootingSteps.default;
      const stepMsg = steps.join("\n");
      const fullMsg = ackMsg + stepMsg + "\n\nDid this resolve your issue? If not, would you like me to book you a slot with an agent? (Yes/No)";
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: fullMsg, from: "bot" }]);
      setConfirmationMode(true);
    } else {
      // Instead of providing solutions, ask for clarification to minimize irrelevant responses
      const clarificationMsg = "I'm sorry, I didn't understand that. Could you please describe your issue in more detail?";
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: clarificationMsg, from: "bot" }]);
    }
  };

  const handleQuickReply = (reply: string) => {
    if (chatDisabled) return;
    setInput(reply);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.bubble, item.from === "user" ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.bubbleText, item.from === "user" && { color: "#fff" }]}>{item.text}</Text>
      </View>
    </Animated.View>
  );

  const QueueItem = ({ item }: { item: QueueItem }) => {
    const slideAnim = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }, []);

    return (
      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        <View style={styles.queueItem}>
          <Text style={styles.queueName}>{item.name} - Ticket: {item.ticketID}</Text>
          <Text style={styles.queueIssue}>Issue: {item.issue}</Text>
          <Text style={styles.queueStatus}>
            Department: {item.department} | Status: {item.status} | Priority: {item.priority} | Wait: {item.expectedWaitTime} min
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={["#09ae48ff", "#F8FBFF", "#FFFFFF"]} style={styles.gradientBackground}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>TelkomX AI Troubleshooter</Text>
            <TouchableOpacity onPress={resetChat} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatContainer}
          />

          {/* Typing indicator */}
          {botTyping && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>TelkomX is typing...</Text>
            </View>
          )}

          {/* Quick Replies */}
          {!chatDisabled && (
            <View style={styles.quickReplies}>
              {quickReplies.map((q) => (
                <TouchableOpacity key={q} style={styles.quickButton} onPress={() => handleQuickReply(q)}>
                  <Text style={styles.quickText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={chatDisabled ? "Chat disabled, awaiting agent..." : "Type your message..."}
              style={styles.input}
              editable={!chatDisabled}
            />
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                onPress={() => {
                  if (chatDisabled) {
                    setMessages((prev) => [
                      ...prev,
                      { id: Date.now().toString(), text: "Your agent will call soon. Please wait.", from: "bot" },
                    ]);
                  } else {
                    animateButtonPress(handleSend);
                  }
                }}
                style={styles.sendBtn}
              >
                <Text style={styles.sendText}>➤</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Predictive Queue */}
          {queue.length > 0 && (
            <View style={styles.queueSection}>
              <Text style={styles.sectionTitle}>Scheduled Support Queue</Text>
              <FlatList data={queue} keyExtractor={(item) => item.id} renderItem={({ item }) => <QueueItem item={item} />} />
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: { flex: 1 },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 45, 
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomWidth: 0,
    borderBottomColor: "#D0D7E0",
  },
  header: { fontSize: 18, fontWeight: "bold", color: "#0057B8" },
  resetBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  resetText: { fontSize: 14, color: "#D32F2F", fontWeight: "600" },
  chatContainer: { padding: 16, paddingBottom: 100, flexGrow: 1 },
  bubble: { 
    maxWidth: "80%", 
    padding: 14, 
    marginVertical: 8, 
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  botBubble: { 
    backgroundColor: "#FFFFFF", 
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D0D7E0",
  },
  userBubble: { 
    backgroundColor: "#00A84F", 
    alignSelf: "flex-end" 
  },
  bubbleText: { fontSize: 15, lineHeight: 20, color: "#333" },
  quickReplies: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8, 
    paddingHorizontal: 16, 
    paddingBottom: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  quickButton: { 
    backgroundColor: "#FFFFFF", 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D0D7E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickText: { fontSize: 14, color: "#0057B8", fontWeight: "600" },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16, 
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopWidth: 1,
    borderTopColor: "#D0D7E0",
  },
  input: { 
    flex: 1, 
    height: 48, 
    paddingHorizontal: 16, 
    borderRadius: 24, 
    borderWidth: 1,
    borderColor: "#D0D7E0", 
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sendBtn: { 
    marginLeft: 12,
    padding: 12,
    backgroundColor: "#0033a0",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendText: { 
    fontSize: 18, 
    color: "#FFFFFF" 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#0033a0", 
    marginBottom: 12,
    marginTop: 19,
    paddingHorizontal: 10,
  },
  queueItem: { 
    backgroundColor: "#FFFFFF", 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D0D7E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  queueName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#0033a0" 
  },
  queueIssue: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 4 
  },
  queueStatus: { 
    fontSize: 12, 
    color: "#00A84F", 
    fontWeight: "600", 
    marginTop: 4 
  },
  typingIndicator: { 
    paddingHorizontal: 16, 
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  typingText: {
    fontStyle: "italic", 
    color: "#0033a0" 
  },
  queueSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
