import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  Modal,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// ---------------- Types ----------------
type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: number;
};

type Solution = {
  by: string;
  role: string;
  note: string;
  verified: boolean;
};

type CardItem = {
  id: string;
  title: string;
  author: string;
  isTechnician?: boolean;
  timestamp: number;
  time: string;
  categories: string[];
  body: string;
  status: string;
  cta: string;
  solution?: Solution;
  upvotes: number;
  sameIssueCount: number;
  comments: Comment[];
};

type CardProps = { item: CardItem; onUpvote: (id: string) => void; onSameIssue: (id: string) => void; onComment: (id: string, text: string) => void; onResolve: (id: string) => void };

// ---------------- Components ----------------
const Pill = ({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning";
}) => (
  <View
    style={[
      styles.pill,
      tone === "success" && { backgroundColor: "#E8F5E8", borderColor: "#00A84F" },
      tone === "warning" && { backgroundColor: "#FFF3E0", borderColor: "#FF9800" },
      tone === "neutral" && { backgroundColor: "#E3F2FD", borderColor: "#0057B8" },
    ]}
  >
    <Text
      style={[
        styles.pillText,
        tone === "success" && { color: "#00A84F" },
        tone === "warning" && { color: "#FF9800" },
        tone === "neutral" && { color: "#0057B8" },
      ]}
    >
      {label}
    </Text>
  </View>
);

const Card = ({ item, onUpvote, onSameIssue, onComment, onResolve }: CardProps) => {
  const isOpen = item.status === "Open";
  const showSolution = !!item.solution;
  const [commentText, setCommentText] = useState("");
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, item.isTechnician && { color: "#0057B8", fontWeight: "700" }]}>
            {item.author}{item.isTechnician ? " (Telkom Support)" : ""} •
          </Text>
          <Text style={styles.metaText}> {item.time}</Text>
        </View>
        <View style={styles.catRow}>
          {item.categories?.map((c) => (
            <Text key={c} style={styles.catText}>
              {c}
            </Text>
          ))}
        </View>
        <Text style={styles.body}>{item.body}</Text>

        {showSolution && item.solution && (
          <View style={styles.solutionBlock}>
            <Pill label="Solution Verified" tone="success" />
            <Text style={styles.techBy}>
              {item.solution.by} ({item.solution.role})
            </Text>
            <Text style={styles.solutionNote}>{item.solution.note}</Text>
          </View>
        )}

        {/* Upvotes and Same Issue */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => onUpvote(item.id)}>
            <Text style={styles.actionBtn}>👍 {item.upvotes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSameIssue(item.id)}>
            <Text style={styles.actionBtn}>📌 Same Issue ({item.sameIssueCount})</Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <View style={{ marginTop: 8 }}>
          {item.comments.map((c) => (
            <Text key={c.id} style={styles.commentText}>
              <Text style={{ fontWeight: "600" }}>{c.author}: </Text>
              {c.text}
            </Text>
          ))}
          <View style={styles.commentBox}>
            <TextInput
              style={{ flex: 1, fontSize: 13 }}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              onPress={() => {
                if (commentText.trim()) {
                  onComment(item.id, commentText);
                  setCommentText("");
                }
              }}
            >
              <Text style={styles.commentSend}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer CTA */}
        <View style={styles.cardFooter}>
          <Pill label={isOpen ? "Open" : "Resolved"} tone={isOpen ? "neutral" : "success"} />
          {isOpen && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.ctaBtn}
              onPress={() => onResolve(item.id)}
            >
              <Text style={styles.ctaText}>Mark Resolved</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// ---------------- Header ----------------
const HeaderBar = ({ onPost }: { onPost: () => void }) => (
  <View style={styles.header}>
    <Text style={styles.headerTime}>{Platform.OS === "ios" ? "9:41" : ""}</Text>
    <Text style={styles.headerTitle}>Community Forum</Text>
    <TouchableOpacity onPress={onPost}>
      <Text style={styles.headerBell}>➕</Text>
    </TouchableOpacity>
  </View>
);

// ---------------- Sample Data ----------------
const initialForumData: CardItem[] = [
  {
    id: "1",
    title: "Fibre Outage - Cape Town",
    author: "Sarah Lee",
    timestamp: Date.now() - 2 * 3600 * 1000,
    time: "2 hr ago",
    categories: ["Cape Town", "Fibre Outage"],
    body: "My fibre connection has been down for the last 2 hours. Located in Gardens, Cape Town.",
    status: "Open",
    cta: "Open",
    upvotes: 3,
    sameIssueCount: 5,
    comments: [],
  },
  {
    id: "2",
    title: "Slow ADSL Speed - Johannesburg",
    author: "Michael Green",
    timestamp: Date.now() - 24 * 3600 * 1000,
    time: "Yesterday",
    categories: ["Johannesburg", "ADSL Speed"],
    body: "Experiencing extremely slow ADSL speeds, especially during peak hours.",
    status: "Closed",
    solution: {
      by: "Technician A",
      role: "Technician",
      note: "We identified a local congestion issue in Sandton. A fix was deployed. Please restart your router.",
      verified: true,
    },
    cta: "Reopen",
    upvotes: 12,
    sameIssueCount: 20,
    comments: [
      { id: "c1", author: "John", text: "Same here in Randburg!", timestamp: Date.now() - 20000 },
    ],
  },
];

// ---------------- Main Page ----------------
export default function CommunityForumPage() {
  const [forumData, setForumData] = useState<CardItem[]>(initialForumData);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("Fibre Outage");

  // Update time dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setForumData((prev) =>
        prev.map((item) => {
          const diff = Math.floor((Date.now() - item.timestamp) / 60000);
          return { ...item, time: diff < 1 ? "Just now" : diff < 60 ? `${diff} min ago` : `${Math.floor(diff / 60)} hr ago` };
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePost = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    const newPost: CardItem = {
      id: Date.now().toString(),
      title: newTitle,
      author: "You",
      timestamp: Date.now(),
      time: "Just now",
      categories: [newCategory],
      body: newBody,
      status: "Open",
      cta: "Open",
      upvotes: 0,
      sameIssueCount: 0,
      comments: [],
    };
    setForumData([newPost, ...forumData]);
    setShowModal(false);
    setNewTitle("");
    setNewBody("");
    setNewCategory("Fibre Outage");
  };

  const handleUpvote = (id: string) => {
    setForumData((prev) => prev.map((i) => (i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i)));
  };

  const handleSameIssue = (id: string) => {
    setForumData((prev) => prev.map((i) => (i.id === id ? { ...i, sameIssueCount: i.sameIssueCount + 1 } : i)));
  };

  const handleComment = (id: string, text: string) => {
    setForumData((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              comments: [...i.comments, { id: Date.now().toString(), author: "You", text, timestamp: Date.now() }],
            }
          : i
      )
    );
  };

  const handleResolve = (id: string) => {
    setForumData((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Closed", cta: "Resolved" } : i))
    );
  };

  return (
    <LinearGradient
      colors={["#E6F3FF", "#F8FBFF", "#FFFFFF"]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 8 : 8 }]}>
        <StatusBar barStyle="dark-content" />
        <HeaderBar onPost={() => setShowModal(true)} />
        <FlatList
          contentContainerStyle={styles.listContent}
          data={forumData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card item={item} onUpvote={handleUpvote} onSameIssue={handleSameIssue} onComment={handleComment} onResolve={handleResolve} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
        />

        {/* Modal */}
        <Modal visible={showModal} animationType="slide" transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Post New Issue</Text>
              <TextInput placeholder="Title" value={newTitle} onChangeText={setNewTitle} style={styles.input} />
              <TextInput
                placeholder="Body"
                value={newBody}
                onChangeText={setNewBody}
                style={[styles.input, { height: 80 }]}
                multiline
              />
              <TextInput
                placeholder="Category (e.g. Fibre Outage, ADSL Speed, Billing)"
                value={newCategory}
                onChangeText={setNewCategory}
                style={styles.input}
              />
              <View style={styles.modalBtns}>
                <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.modalBtn, { backgroundColor: "#E3F2FD" }]}>
                  <Text style={{ color: "#0057B8" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePost} style={[styles.modalBtn, { backgroundColor: "#0057B8" }]}>
                  <Text style={{ color: "#fff" }}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ---------------- Styles ----------------
const colors = {
  bg: "#f6f7fb",
  cardBg: "#fff",
  text: "#111827",
  subtext: "#6b7280",
  border: "#D0D7E0",
  blue: "#0033a0",
  green: "#09ae48ff",
};

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    height: 56,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTime: { width: 40, color: colors.subtext, fontSize: 14 },
  headerTitle: { fontSize: 16, fontWeight: "600", color: colors.blue },
  headerBell: { width: 40, textAlign: "right", fontSize: 22, color: colors.blue },

  listContent: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 72 },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  metaRow: { flexDirection: "row", marginTop: 2, marginBottom: 6 },
  metaText: { color: colors.subtext, fontSize: 12 },
  catRow: { flexDirection: "row", gap: 12, marginBottom: 6 },
  catText: { color: "#9aa3af", fontSize: 11 },
  body: { fontSize: 13, color: "#2f3542", lineHeight: 18, marginTop: 6 },
  solutionBlock: {
    marginTop: 10,
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.green,
  },
  techBy: { marginTop: 8, fontSize: 12, color: colors.subtext, fontWeight: "600" },
  solutionNote: { fontSize: 13, color: "#384152", marginTop: 6, lineHeight: 18 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: { fontSize: 12, fontWeight: "600" },
  ctaBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.blue,
  },
  actionRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  actionBtn: {
    fontSize: 13,
    color: colors.subtext,
  },
  commentText: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: 4,
    lineHeight: 16,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentSend: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 13,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.bg,
    marginBottom: 12,
  },
  modalBtns: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 16,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});