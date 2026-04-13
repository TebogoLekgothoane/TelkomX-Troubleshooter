
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform } from 'react-native';

type Notification = {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
};

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // Mock notifications data - in a real app, this could come from API or global state
    const mockNotifs: Notification[] = [
      {
        id: 'n1',
        message: 'New predictive issue detected in Durban.',
        type: 'warning',
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: 'n2',
        message: 'Ticket t1 updated to In Progress.',
        type: 'info',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: 'n3',
        message: 'Forum issue f1 closed successfully.',
        type: 'success',
        timestamp: new Date(Date.now() - 600000),
      },
      {
        id: 'n4',
        message: 'New user joined the queue: Lerato M.',
        type: 'info',
        timestamp: new Date(Date.now() - 900000),
      },
      {
        id: 'n5',
        message: 'High priority ticket escalated: Network outage.',
        type: 'warning',
        timestamp: new Date(Date.now() - 1200000),
      },
      {
        id: 'n6',
        message: 'Call connected to Sipho K.',
        type: 'success',
        timestamp: new Date(Date.now() - 1500000),
      },
      {
        id: 'n7',
        message: 'AI suggestion attempted by user.',
        type: 'info',
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: 'n8',
        message: 'System update: Agents online increased to 5.',
        type: 'success',
        timestamp: new Date(Date.now() - 2100000),
      },
    ];
    setNotifications(mockNotifs);
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const typeColor = item.type === 'success' ? '#388e3c' : item.type === 'warning' ? '#f57c00' : '#1a237e';
    const typeBgColor = item.type === 'success' ? '#c8e6c9' : item.type === 'warning' ? '#ffe0b2' : '#e8eaf6';
    return (
      <View style={[styles.notificationItem, { backgroundColor: typeBgColor, borderLeftColor: typeColor }]}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.timestamp.toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0033a0',
    padding: 0,
    paddingTop: Platform.OS === 'android' ? 46 : 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  notificationItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationPage;
