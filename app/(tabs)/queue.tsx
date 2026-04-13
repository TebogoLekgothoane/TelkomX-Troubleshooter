
// PredictiveQueuePage.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type QueueItem = {
  id: string;
  name: string;
  issue: string;
  diagnostics: string;
  status: string;
  attempts: number;
  aiSuggestions: string[];
  attemptedSuggestions?: string[];
  priority?: "High" | "Medium" | "Low";
  estimatedDuration?: number;
  joinedAt?: Date;
};

type SystemUpdate = {
  id: string;
  message: string;
  timestamp: Date;
  type: "info" | "warning" | "success";
};

const AVERAGE_HANDLE_TIME = 5;
const MAX_AI_ATTEMPTS = 5;
const MAX_SYSTEM_UPDATES = 10;

const PredictiveQueuePage: React.FC = () => {
  const [queueAhead, setQueueAhead] = useState<QueueItem[]>([]);
  const [currentUser, setCurrentUser] = useState<QueueItem | null>(null);
  const [systemUpdates, setSystemUpdates] = useState<SystemUpdate[]>([]);
  const [agentStatus, setAgentStatus] = useState("Available agents: 3 online");
  const [isRinging, setIsRinging] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  useEffect(() => {
    initializeUser();
    initializeQueue();
    startQueueSimulation();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (queueAhead.length === 0 && currentUser && !isRinging && !isConnected) {
      setIsRinging(true);
      addSystemUpdate("It's your turn! Agent is calling.", "success");
    }
  }, [queueAhead, currentUser, isRinging, isConnected]);

  const startQueueSimulation = () => {
    intervalRef.current = setInterval(() => {
      setQueueAhead((prev) => {
        let newQueue = [...prev];
        if (newQueue.length > 0) {
          // Simulate serving the front of the queue
          newQueue = newQueue.slice(1);
          addSystemUpdate(`${newQueue[0]?.name || "A user"} has been served by an agent.`, "success");
        }
        // Occasionally add a new user to the queue
        if (Math.random() > 0.6) {
          const newItem: QueueItem = {
            id: Date.now().toString() + Math.random(),
            name: getRandomName(),
            issue: getRandomIssue(),
            diagnostics: getRandomDiagnostics(),
            status: "Proactively Booked",
            attempts: 0,
            aiSuggestions: generateAiSuggestions(),
            priority: getRandomPriority(),
            estimatedDuration: getEstimatedDuration(getRandomPriority()),
            joinedAt: new Date(),
          };
          newQueue.push(newItem);
          addSystemUpdate(`${newItem.name} has joined the queue.`, "info");
        }
        return sortQueue(newQueue);
      });
      // Occasionally add AI/system updates
      if (Math.random() > 0.8) {
        addSystemUpdate(getRandomAiMessage(), "info");
      }
    }, 15000); // Simulate every 15 seconds
  };

  const initializeUser = () => {
    const user: QueueItem = {
      id: "current_user",
      name: "You",
      issue: getRandomIssue(),
      diagnostics: getRandomDiagnostics(),
      status: "Proactively Booked",
      attempts: 0,
      aiSuggestions: generateAiSuggestions(),
      attemptedSuggestions: [],
      priority: "Medium",
      estimatedDuration: getEstimatedDuration("Medium"),
      joinedAt: new Date(),
    };
    setCurrentUser(user);
    addSystemUpdate("You have joined the predictive support queue.", "info");
  };

  const initializeQueue = () => {
    const initialQueue: QueueItem[] = [];
    for (let i = 0; i < 3; i++) {
      const prio = getRandomPriority();
      initialQueue.push({
        id: `init${i}`,
        name: getRandomName(),
        issue: getRandomIssue(),
        diagnostics: getRandomDiagnostics(),
        status: "Proactively Booked",
        attempts: Math.floor(Math.random() * 3),
        aiSuggestions: generateAiSuggestions(),
        priority: prio,
        estimatedDuration: getEstimatedDuration(prio),
        joinedAt: new Date(Date.now() - Math.random() * 600000 - 300000),
      });
    }
    setQueueAhead(sortQueue(initialQueue));
  };

  const addSystemUpdate = (message: string, type: SystemUpdate["type"] = "info") => {
    const update: SystemUpdate = { id: Date.now().toString(), message, timestamp: new Date(), type };
    setSystemUpdates((prev) => [update, ...prev].slice(0, MAX_SYSTEM_UPDATES));
  };

  const sortQueue = (queue: QueueItem[]) => {
    return queue.sort((a, b) => {
      const priorityMap: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
      const prioA = priorityMap[a.priority || "Medium"];
      const prioB = priorityMap[b.priority || "Medium"];
      return prioA - prioB || ((a.joinedAt?.getTime() || 0) - (b.joinedAt?.getTime() || 0));
    });
  };

  const getUserPosition = () => {
    return queueAhead.length + 1;
  };

  const getEstimatedWaitTime = () => {
    return queueAhead.reduce((sum, q) => sum + (q.estimatedDuration || AVERAGE_HANDLE_TIME), 0);
  };

  const handleAiSuggestionAttempt = (suggestion: string) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const newAttempts = prev.attempts + 1;
      const attempted = [...(prev.attemptedSuggestions || []), suggestion];
      addSystemUpdate(`Tried AI suggestion: ${suggestion}`, "info");
      if (newAttempts >= MAX_AI_ATTEMPTS) {
        addSystemUpdate("Multiple attempts made. Scheduling agent call.", "warning");
        return { ...prev, attempts: newAttempts, status: "Awaiting Agent – Call Scheduled", attemptedSuggestions: attempted };
      }
      const remainingSuggestions = generateAiSuggestions().filter((s) => !attempted.includes(s));
      return { ...prev, attempts: newAttempts, attemptedSuggestions: attempted, aiSuggestions: remainingSuggestions.length > 0 ? remainingSuggestions : generateAiSuggestions() };
    });
  };

  const handleLeaveQueue = () => {
    Alert.alert("Leave Queue", "Are you sure you want to leave the predictive support queue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => {
          addSystemUpdate("You have left the support queue.", "warning");
          setCurrentUser(null);
        },
      },
    ]);
  };

  const handleRequestCallback = () => {
    Alert.alert("Request Callback", "We will call you back when an agent becomes available.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Request Callback",
        onPress: () => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, status: "Callback Requested" });
          }
          addSystemUpdate("Callback requested. We will call you within 15 minutes.", "success");
        },
      },
    ]);
  };

  const handleAcceptCall = () => {
    setIsRinging(false);
    setIsConnected(true);
    addSystemUpdate("Call accepted. Connected to Agent Sarah.", "success");
  };

  const handleIgnoreCall = () => {
    setIsRinging(false);
    addSystemUpdate("Call ignored. You have left the queue.", "warning");
    setCurrentUser(null);
  };

  const handleEndCall = () => {
    setIsConnected(false);
    addSystemUpdate("Call ended.", "warning");
  };

  const renderQueueItem = ({ item, index }: { item: QueueItem; index: number }) => {
    const priorityColor = item.priority === "High" ? "#D32F2F" : item.priority === "Medium" ? "#FF9800" : "#00A84F";
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={[styles.queueItem, { borderLeftColor: priorityColor }]}>
          <View style={styles.queuePosition}>
            <Text style={styles.positionNumber}>{index + 1}</Text>
          </View>
          <View style={styles.queueDetails}>
            <Text style={styles.queueName}>{item.name}</Text>
            <Text style={styles.queueIssue}>{item.issue}</Text>
            <Text style={styles.queueDiagnostics}>{item.diagnostics}</Text>
            <Text style={styles.queueStatus}>Status: {item.status}</Text>
            <Text style={styles.queuePriority}>Priority: {item.priority}</Text>
            <Text style={styles.queueTime}>Est. Time: {item.estimatedDuration} min</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
            <Text style={styles.priorityBadgeText}>{item.priority}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSystemUpdate = ({ item }: { item: SystemUpdate }) => {
    const updateStyle = item.type === "warning" ? styles.updateWarning : item.type === "success" ? styles.updateSuccess : styles.updateInfo;
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={[styles.updateItem, updateStyle]}>
          <Text style={styles.updateText}>{item.message}</Text>
          <Text style={styles.updateTime}>{item.timestamp.toLocaleTimeString()}</Text>
        </View>
      </Animated.View>
    );
  };

  if (isConnected) {
    return (
      <LinearGradient
        colors={["#E6F3FF", "#F8FBFF", "#FFFFFF"]}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.connectedContainer}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.connectedTitle}>Connected to Agent</Text>
            <Text style={styles.agentName}>Agent Sarah</Text>
            <Text style={styles.connectedMessage}>
              Your issue: {currentUser?.issue}
              {"\n\n"}We're here to help resolve this. Please describe the problem in more detail.
            </Text>
            <View style={styles.callControls}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity onPress={handleEndCall} style={styles.endCallButton}>
                  <Text style={styles.buttonText}>End Call</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (isRinging) {
    return (
      <LinearGradient
        colors={["#E6F3FF", "#F8FBFF", "#FFFFFF"]}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.ringingContainer}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.ringingTitle}>Calling Agent Sarah...</Text>
            <Text style={styles.connectedMessage}>Your turn in queue! Accept to connect.</Text>
            <View style={styles.callButtons}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity onPress={handleAcceptCall} style={styles.acceptButton}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity onPress={handleIgnoreCall} style={styles.ignoreButton}>
                  <Text style={styles.buttonText}>Ignore</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#E6F3FF", "#F8FBFF", "#FFFFFF"]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.header}>TelkomX Predictive Support Queue</Text>
            <Text style={styles.agentStatus}>{agentStatus}</Text>

            {currentUser && (
              <View style={styles.positionCard}>
                <Text style={styles.positionTitle}>Your Position</Text>
                <Text style={styles.positionNumber}>{getUserPosition()}</Text>
                <Text style={styles.estimatedTime}>Estimated Wait: {getEstimatedWaitTime()} min</Text>
                <Text style={styles.issueText}>Issue: {currentUser.issue}</Text>
                <Text style={styles.statusText}>Status: {currentUser.status}</Text>

                {currentUser.aiSuggestions.length > 0 && (
                  <View style={styles.aiSuggestionsContainer}>
                    <Text style={styles.sectionTitle}>AI Suggestions:</Text>
                    {currentUser.aiSuggestions.map((sug, idx) => (
                      <TouchableOpacity key={idx} onPress={() => handleAiSuggestionAttempt(sug)} style={styles.aiSuggestion}>
                        <Text style={styles.aiSuggestionText}>{sug}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {currentUser.attemptedSuggestions && currentUser.attemptedSuggestions.length >= MAX_AI_ATTEMPTS && (
                  <Text style={styles.escalationNotice}>Escalating to agent...</Text>
                )}

                <View style={styles.actionButtons}>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity onPress={handleLeaveQueue} style={styles.leaveButton}>
                      <Text style={styles.buttonText}>Leave Queue</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity onPress={handleRequestCallback} style={styles.callbackButton}>
                      <Text style={styles.buttonText}>Request Callback</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Queue Ahead</Text>
            {queueAhead.length === 0 ? (
              <Text style={styles.emptyText}>No one ahead - you're next!</Text>
            ) : (
              <FlatList
                data={queueAhead}
                renderItem={renderQueueItem}
                keyExtractor={(item) => item.id}
                style={styles.queueList}
                nestedScrollEnabled={true}
              />
            )}

            <Text style={styles.sectionTitle}>Recent System Updates</Text>
            <View style={styles.updatesContainer}>
              <FlatList
                data={systemUpdates}
                renderItem={renderSystemUpdate}
                keyExtractor={(item) => item.id}
                style={styles.updatesList}
                nestedScrollEnabled={true}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "android" ? 70 : 0,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#0057B8",
  },
  agentStatus: {
    fontStyle: "italic",
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
    color: "#0033a0",
  },
  positionCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D7E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  positionTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  positionNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0033a0",
    marginBottom: 8,
  },
  estimatedTime: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginBottom: 8,
  },
  issueText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  statusText: {
    fontSize: 14,
    color: "#00A84F",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  aiSuggestionsContainer: {
    marginTop: 16,
    width: "100%",
  },
  aiSuggestion: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00A84F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aiSuggestionText: {
    fontSize: 14,
    color: "#0033a0",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
  },
  callbackButton: {
    backgroundColor: "#0033a0",
    padding: 14,
    borderRadius: 12,
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaveButton: {
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 12,
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  updatesContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  updatesList: {
    flexGrow: 0,
  },
  updateItem: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  updateInfo: {
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 4,
    borderLeftColor: "#0057B8",
  },
  updateSuccess: {
    backgroundColor: "#E8F5E8",
    borderLeftWidth: 4,
    borderLeftColor: "#0033a0",
  },
  updateWarning: {
    backgroundColor: "#FFEBEE",
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },
  updateText: {
    fontSize: 14,
    color: "#333",
  },
  updateTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  queueList: {
    maxHeight: 250,
  },
  queueItem: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginVertical: 8,
    borderRadius: 16,
    borderLeftWidth: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: "relative",
  },
  queuePosition: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0033a0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  queueDetails: {
    flex: 1,
  },
  queueName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0033a0",
  },
  queueIssue: {
    fontStyle: "italic",
    color: "#666",
    marginTop: 2,
  },
  queueDiagnostics: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  queueStatus: {
    fontSize: 12,
    color: "#00A84F",
    fontWeight: "600",
    marginTop: 4,
  },
  queuePriority: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  queueTime: {
    fontSize: 12,
    color: "#FF9800",
    marginTop: 2,
  },
  priorityBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 11,
  },
  escalationNotice: {
    fontSize: 14,
    color: "#D32F2F",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  // Call states
  connectedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  connectedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00A84F",
    textAlign: "center",
    marginBottom: 16,
  },
  agentName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0057B8",
    marginBottom: 16,
  },
  connectedMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  callControls: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  endCallButton: {
    backgroundColor: "#D32F2F",
    padding: 18,
    borderRadius: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ringingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ringingTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0033a0ff",
    textAlign: "center",
    marginBottom: 16,
  },
  callButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  acceptButton: {
    backgroundColor: "#09ae48ff",
    padding: 18,
    borderRadius: 12,
    flex: 0.48,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ignoreButton: {
    backgroundColor: "#D32F2F",
    padding: 18,
    borderRadius: 12,
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

// --- Random Generators ---
function getRandomAiMessage(): string {
  const messages = [
    "AI detected a possible line fault for a customer.",
    "Predictive analysis: High risk of router failure.",
    "AI flagged abnormal latency in the network.",
    "Proactive booking: Customer may experience downtime.",
    "AI suggests firmware update for several users.",
    "Pattern detected: Multiple users with DNS issues.",
    "AI monitoring: No new issues detected.",
    "Predictive alert: High congestion in Cape Town.",
    "AI recommends remote diagnostics for new cases.",
    "AI: All systems nominal, monitoring continues.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomName(): string {
  const names = [
    "Lerato",
    "Sipho",
    "Thabo",
    "Naledi",
    "Kabelo",
    "Ayanda",
    "Zanele",
    "Tshepo",
    "Nomsa",
    "Sibusiso",
    "Mpho",
    "Thuli",
    "Jabu",
    "Karabo",
    "Palesa",
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomDiagnostics(): string {
  const diagnostics = [
    "Ping to gateway: OK. DNS: OK. Signal: Good.",
    "Ping to gateway: Timeout. DNS: OK. Signal: Weak.",
    "Ping to gateway: OK. DNS: Failed. Signal: Good.",
    "Ping to gateway: OK. DNS: OK. Signal: Intermittent.",
    "Ping to gateway: OK. DNS: OK. Signal: Excellent.",
    "Ping to gateway: Failed. DNS: Failed. Signal: Poor.",
    "Ping to gateway: OK. DNS: OK. Signal: Marginal.",
    "Ping to gateway: OK. DNS: OK. Signal: Fluctuating.",
    "Ping to gateway: OK. DNS: OK. Signal: Stable.",
    "Ping to gateway: OK. DNS: OK. Signal: Dropping packets.",
  ];
  return diagnostics[Math.floor(Math.random() * diagnostics.length)];
}

function getRandomIssue(): string {
  const issues = [
    "Internet connectivity is slow",
    "No internet connection",
    "Frequent disconnections",
    "WiFi not working",
    "Unable to access certain websites",
    "Router keeps rebooting",
    "High latency during gaming",
    "VoIP calls dropping",
    "Intermittent signal loss",
    "Device cannot connect to WiFi",
    "Poor signal strength in some rooms",
    "Modem lights blinking abnormally",
    "Unable to stream videos smoothly",
    "DNS resolution issues",
    "Network congestion detected",
  ];
  return issues[Math.floor(Math.random() * issues.length)];
}

function getRandomPriority(): "High" | "Medium" | "Low" {
  const prios = ["High", "Medium", "Low"] as const;
  return prios[Math.floor(Math.random() * prios.length)];
}

function getEstimatedDuration(priority: "High" | "Medium" | "Low"): number {
  switch (priority) {
    case "High":
      return 15;
    case "Medium":
      return 10;
    case "Low":
      return 5;
    default:
      return 8;
  }
}

function generateAiSuggestions(): string[] {
  const suggestions = [
    "Restart your router by unplugging it for 30 seconds.",
    "Check if all cables are securely connected.",
    "Try connecting with a different device to isolate the issue.",
    "Forgot your WiFi password? Check the sticker on the router.",
    "Move closer to the router to improve signal strength.",
    "Disable any VPN or proxy settings temporarily.",
    "Update your device's network drivers.",
    "Flush your DNS cache. On Windows: ipconfig /flushdns",
    "Power cycle your modem and router in this order: modem off, router off, wait 30s, modem on, wait 1min, router on.",
    "Access your router admin page at 192.168.1.1 and check for firmware updates.",
  ];
  const selected: string[] = [];
  while (selected.length < 3) {
    const idx = Math.floor(Math.random() * suggestions.length);
    if (!selected.includes(suggestions[idx])) {
      selected.push(suggestions[idx]);
    }
  }
  return selected;
}

export default PredictiveQueuePage;
