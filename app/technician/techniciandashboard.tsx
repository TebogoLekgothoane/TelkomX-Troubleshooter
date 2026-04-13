// TechnicianDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

type EscalatedTicket = {
  id: string;
  customerName: string;
  issue: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  escalatedFrom: string;
  createdAt: Date;
  priority: 'High' | 'Medium' | 'Low';
};

type Notification = {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
};

const TechnicianDashboard: React.FC = () => {
  const [escalatedTickets, setEscalatedTickets] = useState<EscalatedTicket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Mock escalated tickets
    const mockTickets: EscalatedTicket[] = [
      {
        id: 'et1',
        customerName: 'Thabo N.',
        issue: 'Persistent network outage affecting entire office building',
        status: 'Pending',
        escalatedFrom: 'Agent Sarah',
        createdAt: new Date(Date.now() - 1200000),
        priority: 'High',
      },
      {
        id: 'et2',
        customerName: 'Naledi P.',
        issue: 'Hardware failure suspected - modem not responding',
        status: 'In Progress',
        escalatedFrom: 'Agent John',
        createdAt: new Date(Date.now() - 1800000),
        priority: 'Medium',
      },
      {
        id: 'et3',
        customerName: 'Sipho M.',
        issue: 'Intermittent connection drops during peak hours',
        status: 'Pending',
        escalatedFrom: 'Agent Mary',
        createdAt: new Date(Date.now() - 2400000),
        priority: 'Low',
      },
      {
        id: 'et4',
        customerName: 'Lerato K.',
        issue: 'Speed issues - getting 10% of promised bandwidth',
        status: 'Pending',
        escalatedFrom: 'Agent David',
        createdAt: new Date(Date.now() - 3600000),
        priority: 'High',
      },
    ];
    setEscalatedTickets(mockTickets);

    // Mock notifications
    const mockNotifs: Notification[] = [
      {
        id: 'n1',
        message: 'New outage reported in Pretoria.',
        type: 'warning',
        timestamp: new Date(),
      },
      {
        id: 'n2',
        message: 'Forum issue f1 assigned to you.',
        type: 'info',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: 'n3',
        message: 'Ticket et2 requires immediate attention.',
        type: 'warning',
        timestamp: new Date(Date.now() - 600000),
      },
    ];
    setNotifications(mockNotifs);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: EscalatedTicket['status']) => {
    setEscalatedTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      message: `Escalated ticket ${ticketId} updated to ${newStatus}.`,
      type: 'success',
      timestamp: new Date(),
    }]);
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
      case 'Resolved': return '#388e3c';
      case 'In Progress': return '#f57c00';
      case 'Pending': return '#d32f2f';
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

  const activeTickets = escalatedTickets.filter(t => t.status !== 'Resolved');
  const recentNotifications = notifications.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('./(auth)/login')}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.titleSection}>
        <FontAwesome5 name="tools" size={28} color="#1a237e" />
        <Text style={styles.pageTitle}>Assigned Issues ({activeTickets.length})</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Tickets */}
        {activeTickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketItem}>
            <View style={styles.itemHeader}>
              <View style={styles.customerInfo}>
                <Text style={styles.itemTitle}>{ticket.customerName}</Text>
                <Text style={styles.escalatedFrom}>Escalated from: {ticket.escalatedFrom}</Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
                  <Text style={styles.priorityText}>{ticket.priority}</Text>
                </View>
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

        {activeTickets.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="check-circle" size={64} color="#388e3c" />
            <Text style={styles.emptyStateText}>No Active Assignments</Text>
            <Text style={styles.emptyStateSubtext}>All escalated tickets have been resolved</Text>
          </View>
        )}

        {/* Recent Notifications Section */}
        {recentNotifications.length > 0 && (
          <View style={styles.notificationsSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="notifications" size={24} color="#1a237e" />
              <Text style={styles.sectionTitle}>Recent Notifications</Text>
            </View>
            
            {recentNotifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <View style={styles.notificationHeader}>
                  <Ionicons 
                    name={notification.type === 'warning' ? 'warning' : notification.type === 'success' ? 'checkmark-circle' : 'information-circle'} 
                    size={20} 
                    color={notification.type === 'warning' ? '#f57c00' : notification.type === 'success' ? '#388e3c' : '#1a237e'} 
                  />
                  <Text style={styles.notificationTime}>{formatTime(notification.timestamp)}</Text>
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton} 
              onPress={() => router.push('./technician/notificationpage')}
            >
              <Text style={styles.viewAllText}>View All Notifications</Text>
              <Ionicons name="arrow-forward" size={16} color="#1a237e" />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => router.push('./technician/technicianforums')}
            >
              <Ionicons name="chatbubbles" size={32} color="#1a237e" />
              <Text style={styles.quickActionText}>Forum Issues</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => router.push('./technician/technicianoutages')}
            >
              <MaterialIcons name="warning" size={32} color="#d32f2f" />
              <Text style={styles.quickActionText}>Service Outages</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: Platform.OS === 'android' ? 0 : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
padding: 18,

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
    backgroundColor: '#3ee17ce8',
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
  notificationsSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 8,
  },
  notificationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
    marginRight: 4,
  },
  quickActionsSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
    marginTop: 8,
    textAlign: 'center',
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

export default TechnicianDashboard;