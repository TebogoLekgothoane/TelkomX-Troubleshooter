// ActiveTickets.tsx (app/agent/activetickets.tsx)
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Ticket = {
  id: string;
  customerName: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  agentAssigned: string;
  createdAt: Date;
};

type Notification = {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
};

const ActiveTickets: React.FC = () => {
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mock tickets
    const mockTickets: Ticket[] = [
      {
        id: 't1',
        customerName: 'Thabo N.',
        issue: 'Billing inquiry escalation',
        status: 'In Progress',
        agentAssigned: 'Agent Sarah',
        createdAt: new Date(Date.now() - 1200000),
      },
      {
        id: 't2',
        customerName: 'Naledi P.',
        issue: 'Network outage',
        status: 'Open',
        agentAssigned: '',
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        id: 't3',
        customerName: 'Sipho M.',
        issue: 'Password reset',
        status: 'Open',
        agentAssigned: '',
        createdAt: new Date(Date.now() - 2400000),
      },
      {
        id: 't4',
        customerName: 'Lerato K.',
        issue: 'Service upgrade request',
        status: 'In Progress',
        agentAssigned: 'Agent Sarah',
        createdAt: new Date(Date.now() - 3600000),
      },
    ];
    setActiveTickets(mockTickets);

    // Mock notifications (for consistency, though not used here)
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

  const handleUpdateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setActiveTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus, agentAssigned: 'Agent Sarah' } : t));
    // In a real app, add to notifications
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return '#388e3c';
      case 'In Progress': return '#f57c00';
      case 'Open': return '#d32f2f';
      case 'Escalated': return '#1a237e';
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

  const openTickets = activeTickets.filter(t => t.status !== 'Resolved');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.titleSection}>
        <FontAwesome5 name="clipboard-list" size={28} color="#1a237e" />
        <Text style={styles.pageTitle}>Active Tickets ({openTickets.length})</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {openTickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketItem}>
            <View style={styles.itemHeader}>
              <View style={styles.customerInfo}>
                <Text style={styles.itemTitle}>{ticket.customerName}</Text>
                <Text style={styles.escalatedFrom}>Assigned: {ticket.agentAssigned || 'Unassigned'}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[styles.status, { color: getStatusColor(ticket.status) }]}>
                  {ticket.status}
                </Text>
              </View>
            </View>
            
            <Text style={styles.issue}>{ticket.issue}</Text>
            <Text style={styles.timestamp}>Created: {formatTime(ticket.createdAt)}</Text>
            
            {ticket.status !== 'Resolved' && (
              <View style={styles.ticketActions}>
                <TouchableOpacity
                  style={[styles.statusButton, styles.inProgressButton]}
                  onPress={() => handleUpdateTicketStatus(ticket.id, 'In Progress')}
                  disabled={ticket.status === 'In Progress'}
                >
                  <Text style={styles.buttonText}>
                    {ticket.status === 'In Progress' ? 'In Progress' : 'Start Work'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusButton, styles.resolveButton]}
                  onPress={() => handleUpdateTicketStatus(ticket.id, 'Resolved')}
                >
                  <Text style={styles.buttonText}>Resolve</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {openTickets.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="check-circle" size={64} color="#388e3c" />
            <Text style={styles.emptyStateText}>No Active Tickets</Text>
            <Text style={styles.emptyStateSubtext}>All tickets have been resolved</Text>
          </View>
        )}
      </ScrollView>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Reuse styles from AgentDashboard, adapted where needed
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23ced4ff',
    padding: 0,
    paddingTop: Platform.OS === 'android' ? 0 : 16,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 12,
  },
   backButton: {
    padding: 8,
    marginRight: 16,
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
  escalatedFrom: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
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

export default ActiveTickets;