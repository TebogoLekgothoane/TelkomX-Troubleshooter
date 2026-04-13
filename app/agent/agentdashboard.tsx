// AgentQueue.tsx (app/agent/agentqueue.tsx)
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type QueueItem = {
  id: string;
  customerName: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedDuration: number;
  joinedAt: Date;
  status: 'Waiting' | 'Ringing' | 'Connected' | 'Completed';
};

type Notification = {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
};

const AgentQueue: React.FC = () => {
  const [currentQueue, setCurrentQueue] = useState<QueueItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mock data for queue
    const mockQueue: QueueItem[] = [
      {
        id: '1',
        customerName: 'Lerato M.',
        issue: 'Slow internet speeds',
        priority: 'High',
        estimatedDuration: 15,
        joinedAt: new Date(Date.now() - 300000),
        status: 'Waiting',
      },
      {
        id: '2',
        customerName: 'Sipho K.',
        issue: 'Router setup issues',
        priority: 'Medium',
        estimatedDuration: 10,
        joinedAt: new Date(Date.now() - 600000),
        status: 'Ringing',
      },
      {
        id: '3',
        customerName: 'Thabo N.',
        issue: 'Billing inquiry',
        priority: 'Low',
        estimatedDuration: 5,
        joinedAt: new Date(Date.now() - 900000),
        status: 'Waiting',
      },
      {
        id: '4',
        customerName: 'Naledi P.',
        issue: 'Connection problems',
        priority: 'High',
        estimatedDuration: 20,
        joinedAt: new Date(Date.now() - 1200000),
        status: 'Ringing',
      },
    ];
    setCurrentQueue(mockQueue);

    // Mock notifications (for consistency)
    const mockNotifs: Notification[] = [
      {
        id: 'n1',
        message: 'New predictive issue detected in Durban.',
        type: 'warning',
        timestamp: new Date(),
      },
      {
        id: 'n2',
        message: 'Ticket t1 updated to In Progress.',
        type: 'info',
        timestamp: new Date(Date.now() - 300000),
      },
    ];
    setNotifications(mockNotifs);
  };

  const handleStartCall = (item: QueueItem) => {
    setCurrentQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'Connected' } : q));
    Alert.alert('Calling', `Calling ${item.customerName}`);
    // Simulate navigation to call screen
    router.push('/agenttickets');
  };

  const handleAcceptCall = (item: QueueItem) => {
    setCurrentQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'Connected' } : q));
    Alert.alert('Call Accepted', `Connecting to ${item.customerName}`);
    // Simulate navigation to call screen
    router.push('/agenttickets');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#d32f2f';
      case 'Medium': return '#f57c00';
      case 'Low': return '#388e3c';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return '#388e3c';
      case 'Ringing': return '#f57c00';
      case 'Waiting': return '#d32f2f';
      default: return '#666';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return `${minutes}m ago`;
    }
  };

  const activeQueue = currentQueue.filter(q => q.status !== 'Completed');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agent Queue</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.titleSection}>
        <MaterialIcons name="queue" size={28} color="#1a237e" />
        <Text style={styles.pageTitle}>Current Queue ({activeQueue.length})</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeQueue.map((item) => (
          <View key={item.id} style={styles.ticketItem}>
            <View style={styles.itemHeader}>
              <View style={styles.customerInfo}>
                <Text style={styles.itemTitle}>{item.customerName}</Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                  <Text style={styles.priorityText}>{item.priority}</Text>
                </View>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            
            <Text style={styles.issue}>{item.issue}</Text>
            <Text style={styles.timestamp}>Joined: {formatTime(item.joinedAt)}</Text>
            <Text style={styles.timestamp}>Est. Time: {item.estimatedDuration} min</Text>
            
            {(item.status === 'Waiting' || item.status === 'Ringing') && (
              <View style={styles.ticketActions}>
                <TouchableOpacity
                  style={[styles.statusButton, item.status === 'Waiting' ? styles.inProgressButton : styles.resolveButton]}
                  onPress={() => item.status === 'Waiting' ? handleStartCall(item) : handleAcceptCall(item)}
                >
                  <Text style={styles.buttonText}>
                    {item.status === 'Waiting' ? 'Call Now' : 'Accept Call'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {activeQueue.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="check-circle" size={64} color="#388e3c" />
            <Text style={styles.emptyStateText}>No Active Calls</Text>
            <Text style={styles.emptyStateSubtext}>The queue is currently empty</Text>
          </View>
        )}
      </ScrollView>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0033a0',
    padding: 0,
    paddingTop: Platform.OS === 'android' ? 9 : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ticketItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  issue: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  inProgressButton: {
    backgroundColor: '#0033a0',
  },
  resolveButton: {
    backgroundColor: '#09ae48ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
   backButton: {
    padding: 8,
    marginRight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  navbar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#09ae48ff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default AgentQueue;
