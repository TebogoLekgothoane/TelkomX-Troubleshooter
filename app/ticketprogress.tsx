import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Interfaces
interface TicketMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Pending Customer' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  estimatedResolution: string;
  messages: TicketMessage[];
  satisfactionRating?: number;
}

const CustomerTicketProgress: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showTicketList, setShowTicketList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock customer data
  const customerInfo = {
    name: 'Sarah Johnson',
    accountNumber: 'TK987654321',
    email: 'sarah.johnson@email.com',
    phone: '+27 11 123 4567',
  };

  // Handle window dimension changes
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Load tickets
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with actual API call in production
      const mockTickets: Ticket[] = [
        {
          id: 'T-2024-001',
          title: 'Internet Connection Issues',
          description: 'Experiencing frequent disconnections and slow speeds during peak hours',
          status: 'In Progress',
          priority: 'High',
          category: 'Connectivity',
          createdAt: '2024-12-15T09:00:00Z',
          updatedAt: '2024-12-15T14:30:00Z',
          assignedAgent: 'Al Troubleshooter',
          estimatedResolution: '2024-12-16T17:00:00Z',
          messages: [
            {
              id: 'm1',
              sender: 'customer',
              senderName: 'Sarah Johnson',
              message: 'Hi, I\'m experiencing frequent internet disconnections especially during evening hours. The connection drops every 15-20 minutes.',
              timestamp: '2024-12-15T09:00:00Z',
            },
            {
              id: 'm2',
              sender: 'system',
              senderName: 'System',
              message: 'Ticket created and assigned to technical support team.',
              timestamp: '2024-12-15T09:01:00Z',
            },
            {
              id: 'm3',
              sender: 'agent',
              senderName: 'Al troubleshooter',
              message: 'Hi Sarah, thank you for contacting us. I\'ve reviewed your account and can see some signal instability. I\'ve initiated remote diagnostics on your connection. Can you please run a speed test and share the results?',
              timestamp: '2024-12-15T10:30:00Z',
            },
            {
              id: 'm4',
              sender: 'customer',
              senderName: 'Sarah Johnson',
              message: 'Speed test results: Download: 12Mbps, Upload: 2Mbps, Ping: 45ms. This is much lower than my 50Mbps package.',
              timestamp: '2024-12-15T11:15:00Z',
            },
            {
              id: 'm5',
              sender: 'agent',
              senderName: 'AI troubleshooter',
              message: 'Thank you for the speed test results. I can see the issue is related to signal attenuation on your line. I\'ve scheduled a technician visit for tomorrow between 2-5 PM to check your equipment and connection.',
              timestamp: '2024-12-15T14:30:00Z',
            },
          ],
        },
        {
          id: 'T-2024-002',
          title: 'Billing Query - Unexpected Charges',
          description: 'Questions about additional charges on my December bill',
          status: 'Resolved',
          priority: 'Medium',
          category: 'Billing',
          createdAt: '2024-12-10T14:20:00Z',
          updatedAt: '2024-12-12T16:45:00Z',
          assignedAgent: 'Al troubleshooter',
          estimatedResolution: '2024-12-11T17:00:00Z',
          messages: [
            {
              id: 'm6',
              sender: 'customer',
              senderName: 'Sarah Johnson',
              message: 'I noticed additional charges of R150 on my December bill that I don\'t understand. Could you please explain what these are for?',
              timestamp: '2024-12-10T14:20:00Z',
            },
            {
              id: 'm7',
              sender: 'agent',
              senderName: 'Al troubleshooter',
              message: 'Hi Sarah, I"ve reviewed your account. The R150 charge is for a technician callout fee from November when we installed your upgraded router. This was mentioned in the service agreement.',
              timestamp: '2024-12-11T09:30:00Z',
            },
            {
              id: 'm8',
              sender: 'customer',
              senderName: 'Sarah Johnson',
              message: 'I understand now. Thank you for the clarification. The issue is resolved.',
              timestamp: '2024-12-12T16:45:00Z',
            },
          ],
          satisfactionRating: 5,
        },
        {
          id: 'T-2024-003',
          title: 'Service Upgrade Request',
          description: 'Request to upgrade from 20Mbps to 50Mbps fiber package',
          status: 'Pending Customer',
          priority: 'Low',
          category: 'Service Changes',
          createdAt: '2024-12-08T11:30:00Z',
          updatedAt: '2024-12-09T15:20:00Z',
          assignedAgent: 'Al troubleshooter',
          estimatedResolution: '2024-12-16T17:00:00Z',
          messages: [
            {
              id: 'm9',
              sender: 'customer',
              senderName: 'Sarah Johnson',
              message: 'I would like to upgrade my current 20Mbps package to 50Mbps. What would be the cost difference?',
              timestamp: '2024-12-08T11:30:00Z',
            },
            {
              id: 'm10',
              sender: 'agent',
              senderName: 'Al troubleshooter',
              message: 'Hi Sarah, the upgrade would be an additional R200 per month. The new package includes unlimited data and priority support. I can process this upgrade for you. Would you like to proceed?',
              timestamp: '2024-12-09T15:20:00Z',
            },
          ],
        },
      ];
      setTickets(mockTickets);
    } catch (err) {
      setError('Failed to load tickets. Please try again.');
      Alert.alert('Error', 'Failed to load tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Utility functions
  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      Open: '#2196F3',
      'In Progress': '#FF9800',
      'Pending Customer': '#9C27B0',
      Resolved: '#4CAF50',
      Closed: '#757575',
    };
    return colors[status] || '#757575';
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    const colors: Record<string, string> = {
      Critical: '#D32F2F',
      High: '#F44336',
      Medium: '#FF9800',
      Low: '#4CAF50',
    };
    return colors[priority] || '#757575';
  }, []);

  const getStatusIcon = useCallback((status: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      Open: 'radio-button-off',
      'In Progress': 'time',
      'Pending Customer': 'alert-circle',
      Resolved: 'checkmark-circle',
      Closed: 'checkmark-circle',
    };
    return icons[status] || 'radio-button-off';
  }, []);

  const formatDateTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Send message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedTicket) return;
    if (newMessage.length > 500) {
      Alert.alert('Error', 'Message cannot exceed 500 characters.');
      return;
    }

    setIsLoading(true);
    const message: TicketMessage = {
      id: `m${Date.now()}`,
      sender: 'customer',
      senderName: customerInfo.name,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === selectedTicket.id
          ? { ...ticket, messages: [...ticket.messages, message], updatedAt: new Date().toISOString() }
          : ticket
      )
    );
    setSelectedTicket((prev) =>
      prev ? { ...prev, messages: [...prev.messages, message] } : null
    );
    setNewMessage('');
    setIsLoading(false);
  }, [newMessage, selectedTicket, customerInfo.name]);

  // Submit rating
  const submitRating = useCallback(() => {
    if (!selectedTicket || rating === 0) return;

    setIsLoading(true);
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === selectedTicket.id ? { ...ticket, satisfactionRating: rating } : ticket
      )
    );
    setSelectedTicket((prev) => (prev ? { ...prev, satisfactionRating: rating } : null));
    setShowSatisfactionModal(false);
    setRating(0);
    setFeedback('');
    setIsLoading(false);
    Alert.alert('Success', 'Thank you for your feedback!');
  }, [rating, selectedTicket]);

  // Select ticket
  const selectTicket = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketList(false);
  }, []);

  // Memoized render functions
  const renderTicketItem = useCallback(
    ({ item }: { item: Ticket }) => (
      <TouchableOpacity
        style={[styles.ticketItem, selectedTicket?.id === item.id && styles.selectedTicket]}
        onPress={() => selectTicket(item)}
        accessibilityLabel={`Select ticket ${item.id}`}
        accessibilityRole="button"
      >
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.ticketTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.ticketDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.ticketFooter}>
          <Text style={styles.ticketDate}>{formatDateTime(item.updatedAt)}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [selectedTicket, getStatusColor, getPriorityColor, formatDateTime, selectTicket]
  );

  const renderMessage = useCallback(
    ({ item }: { item: TicketMessage }) => (
      <View
        style={[
          styles.messageContainer,
          item.sender === 'customer' ? styles.customerMessage : styles.agentMessage,
          item.sender === 'system' && styles.systemMessage,
        ]}
      >
        <View style={styles.messageHeader}>
          <View style={styles.messageSender}>
            <Ionicons
              name={item.sender === 'customer' ? 'person' : item.sender === 'system' ? 'settings' : 'people'}
              size={16}
              color={item.sender === 'customer' ? '#fff' : '#666'}
            />
            <Text
              style={[styles.senderName, item.sender === 'customer' && styles.customerSenderName]}
            >
              {item.senderName}
            </Text>
          </View>
          <Text
            style={[styles.messageTime, item.sender === 'customer' && styles.customerMessageTime]}
          >
            {formatDateTime(item.timestamp)}
          </Text>
        </View>
        <Text
          style={[styles.messageText, item.sender === 'customer' && styles.customerMessageText]}
        >
          {item.message}
        </Text>
        {item.attachments && item.attachments.length > 0 && (
          <View style={styles.attachments}>
            {item.attachments.map((attachment, index) => (
              <View key={index} style={styles.attachment}>
                <Ionicons name="attach" size={16} color="#666" />
                <Text style={styles.attachmentName}>{attachment}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    ),
    [formatDateTime]
  );

  // Memoized ticket list
  const ticketList = useMemo(
    () => (
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#1a237e" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadTickets}
              accessibilityLabel="Retry loading tickets"
              accessibilityRole="button"
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#DDD" />
            <Text style={styles.emptyStateTitle}>No Tickets Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              You currently have no support tickets. Create a new ticket to get started.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>My Tickets ({tickets.length})</Text>
            </View>
            <FlatList
              data={tickets}
              renderItem={renderTicketItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ticketsList}
              initialNumToRender={10}
              windowSize={5}
            />
          </>
        )}
      </View>
    ),
    [isLoading, error, tickets, renderTicketItem, loadTickets]
  );

  // Responsive layout
  if (showTicketList && windowWidth < 768) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support Tickets</Text>
          <View style={styles.headerRight}>
            <Text style={styles.customerName}>{customerInfo.name}</Text>
          </View>
        </View>
        {ticketList}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (windowWidth < 768) {
              setShowTicketList(true);
            } else {
              router.back();
            }
          }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedTicket ? selectedTicket.id : 'Support Tickets'}
        </Text>
        <View style={styles.headerRight}>
          <Text style={styles.customerName}>{customerInfo.name}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        {isLoading && <ActivityIndicator size="large" color="#1a237e" style={styles.loader} />}
        {selectedTicket ? (
          <>
            <View style={styles.ticketDetailsHeader}>
              <View style={styles.ticketTitleSection}>
                <Text style={styles.detailsTitle}>{selectedTicket.title}</Text>
                <Text style={styles.detailsDescription}>{selectedTicket.description}</Text>
              </View>
              <View style={styles.ticketStatus}>
                <Ionicons
                  name={getStatusIcon(selectedTicket.status)}
                  size={20}
                  color={getStatusColor(selectedTicket.status)}
                />
                <Text style={[styles.statusLabel, { color: getStatusColor(selectedTicket.status) }]}>
                  {selectedTicket.status}
                </Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Priority</Text>
                <Text style={[styles.infoValue, { color: getPriorityColor(selectedTicket.priority) }]}>
                  {selectedTicket.priority}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Agent</Text>
                <Text style={styles.infoValue}>{selectedTicket.assignedAgent}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Category</Text>
                <Text style={styles.infoValue}>{selectedTicket.category}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>{formatDateTime(selectedTicket.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.messagesSection}>
              <Text style={styles.sectionTitle}>Communication History</Text>
              <FlatList
                data={selectedTicket.messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.messagesList}
                initialNumToRender={10}
                windowSize={5}
              />
            </View>

            {selectedTicket.status !== 'Closed' && (
              <View style={styles.messageInputSection}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.messageInput}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type your message here..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    maxLength={500}
                    accessibilityLabel="Message input"
                    accessibilityRole="text"
                  />
                  <TouchableOpacity
                    style={styles.attachButton}
                    accessibilityLabel="Attach file"
                    accessibilityRole="button"
                  >
                    <Ionicons name="attach" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                <View style={styles.messageFooter}>
                  <Text style={styles.charCount}>{newMessage.length}/500</Text>
                  <TouchableOpacity
                    onPress={sendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    style={[styles.sendButton, (!newMessage.trim() || isLoading) ? styles.sendButtonDisabled : null]}
                    accessibilityLabel="Send message"
                    accessibilityRole="button"
                  >
                    <Ionicons name="send" size={20} color="#fff" />
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedTicket.status === 'Resolved' && !selectedTicket.satisfactionRating && (
              <View style={styles.satisfactionPrompt}>
                <Text style={styles.satisfactionTitle}>How was your support experience?</Text>
                <Text style={styles.satisfactionSubtitle}>
                  Please rate your satisfaction with the resolution
                </Text>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => setShowSatisfactionModal(true)}
                  accessibilityLabel="Rate support experience"
                  accessibilityRole="button"
                >
                  <Text style={styles.rateButtonText}>Rate Experience</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedTicket.satisfactionRating && (
              <View style={styles.satisfactionThankYou}>
                <Text style={styles.thankYouTitle}>Thank you for your feedback!</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= selectedTicket.satisfactionRating! ? 'star' : 'star-outline'}
                      size={20}
                      color={star <= selectedTicket.satisfactionRating! ? '#FFD700' : '#DDD'}
                    />
                  ))}
                  <Text style={styles.ratingText}>
                    {selectedTicket.satisfactionRating} out of 5 stars
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          ticketList
        )}
      </KeyboardAvoidingView>

      <Modal
        visible={showSatisfactionModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            <Text style={styles.modalSubtitle}>
              How satisfied are you with the resolution of your ticket?
            </Text>

            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                  accessibilityLabel={`Rate ${star} stars`}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= rating ? '#FFD700' : '#DDD'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.feedbackInput}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Additional feedback (optional)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
              accessibilityLabel="Feedback input"
              accessibilityRole="text"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowSatisfactionModal(false)}
                accessibilityLabel="Cancel rating"
                accessibilityRole="button"
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitButton, (rating === 0 || isLoading) ? styles.modalSubmitButtonDisabled : null]}
                onPress={submitRating}
                disabled={rating === 0 || isLoading}
                accessibilityLabel="Submit rating"
                accessibilityRole="button"
              >
                <Text style={styles.modalSubmitText}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0033a0',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 50 : 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  customerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0033a0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketsList: {
    padding: 16,
  },
  ticketItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedTicket: {
    borderLeftWidth: 4,
    borderLeftColor: '#0033a0',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketDate: {
    fontSize: 12,
    color: '#888',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  ticketDetailsHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ticketTitleSection: {
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  ticketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  messagesSection: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  customerMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0033a0',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  agentMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 8,
    maxWidth: '70%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageSender: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  customerSenderName: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
  },
  customerMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  customerMessageText: {
    color: '#fff',
  },
  attachments: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  messageInputSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  attachButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    fontSize: 12,
    color: '#888',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#33d170e8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  satisfactionPrompt: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  satisfactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  satisfactionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  rateButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  satisfactionThankYou: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  thankYouTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#1a237e',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalSubmitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CustomerTicketProgress;