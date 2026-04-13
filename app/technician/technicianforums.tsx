// technician/forums.tsx
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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

type ForumIssue = {
  id: string;
  location: string;
  issue: string;
  customerName: string;
  accountNumber: string;
  isOpen: boolean;
  responses: {
    id: string;
    message: string;
    timestamp: string;
    technicianName: string;
  }[];
  priority: 'High' | 'Medium' | 'Low';
  dateReported: string;
  category: string;
};

const ForumsPage: React.FC = () => {
  const [forumIssues, setForumIssues] = useState<ForumIssue[]>([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ForumIssue | null>(null);
  const [responseText, setResponseText] = useState('');
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  // Mock technician info
  const currentTechnician = 'Alex Molefe';

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = () => {
    const mockForum: ForumIssue[] = [
      {
        id: 'f1',
        location: 'Johannesburg - Sandton',
        issue: 'Frequent disconnections in Sandton area during peak hours (7-9 PM). Multiple customers affected in the same building complex.',
        customerName: 'Ayanda Z.',
        accountNumber: 'TK123456789',
        isOpen: true,
        responses: [
          {
            id: 'r1',
            message: 'Initial investigation shows possible network congestion. Checking infrastructure.',
            timestamp: '2024-12-15 14:30',
            technicianName: 'Sarah Johnson'
          }
        ],
        priority: 'High',
        dateReported: '2024-12-15',
        category: 'Network Connectivity',
      },
      {
        id: 'f2',
        location: 'Cape Town - CBD',
        issue: 'WiFi signal weak in CBD area, affecting multiple business customers. Signal strength drops significantly during business hours.',
        customerName: 'Zanele T.',
        accountNumber: 'TK987654321',
        isOpen: true,
        responses: [],
        priority: 'Medium',
        dateReported: '2024-12-14',
        category: 'Signal Quality',
      },
      {
        id: 'f3',
        location: 'Durban - Umhlanga',
        issue: 'Router firmware issues causing intermittent slow speeds and connection drops.',
        customerName: 'Tshepo M.',
        accountNumber: 'TK555444333',
        isOpen: false,
        responses: [
          {
            id: 'r2',
            message: 'Firmware updated remotely to version 2.1.5. Issue resolved. Customer confirmed normal speeds restored.',
            timestamp: '2024-12-14 16:45',
            technicianName: 'Mike Stevens'
          }
        ],
        priority: 'Low',
        dateReported: '2024-12-14',
        category: 'Equipment',
      },
      {
        id: 'f4',
        location: 'Pretoria - Centurion',
        issue: 'Internet connection drops every 15-20 minutes, requiring router restart. Issue persists across multiple devices.',
        customerName: 'Nomsa K.',
        accountNumber: 'TK111222333',
        isOpen: true,
        responses: [],
        priority: 'High',
        dateReported: '2024-12-15',
        category: 'Connection Stability',
      },
      {
        id: 'f5',
        location: 'Port Elizabeth - Newton Park',
        issue: 'Slow upload speeds in residential area affecting home office workers. Download speeds normal.',
        customerName: 'Themba L.',
        accountNumber: 'TK777888999',
        isOpen: true,
        responses: [],
        priority: 'Low',
        dateReported: '2024-12-13',
        category: 'Speed Issues',
      },
    ];
    setForumIssues(mockForum);
  };

  const handleRespondToForum = (issue: ForumIssue) => {
    setSelectedIssue(issue);
    setResponseText('');
    setShowResponseModal(true);
  };

  const submitResponse = () => {
    if (!responseText.trim()) {
      Alert.alert('Error', 'Please enter a response before submitting.');
      return;
    }

    if (!selectedIssue) return;

    const newResponse = {
      id: Date.now().toString(),
      message: responseText.trim(),
      timestamp: new Date().toLocaleString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      technicianName: currentTechnician
    };

    Alert.alert(
      'Submit Response',
      'Do you want to mark this issue as resolved?',
      [
        {
          text: 'Just Respond',
          onPress: () => {
            setForumIssues(prev => prev.map(f => 
              f.id === selectedIssue.id 
                ? { ...f, responses: [...f.responses, newResponse] }
                : f
            ));
            setShowResponseModal(false);
            setSelectedIssue(null);
            setResponseText('');
          }
        },
        {
          text: 'Respond & Close',
          style: 'default',
          onPress: () => {
            setForumIssues(prev => prev.map(f => 
              f.id === selectedIssue.id 
                ? { ...f, isOpen: false, responses: [...f.responses, newResponse] }
                : f
            ));
            setShowResponseModal(false);
            setSelectedIssue(null);
            setResponseText('');
            Alert.alert('Success', 'Issue has been resolved and closed.');
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Network Connectivity': return 'wifi';
      case 'Signal Quality': return 'cellular';
      case 'Equipment': return 'router';
      case 'Connection Stability': return 'sync';
      case 'Speed Issues': return 'speedometer';
      default: return 'help-circle';
    }
  };

  const openIssues = forumIssues.filter(f => f.isOpen);
  const closedIssues = forumIssues.filter(f => !f.isOpen);

  const renderIssueCard = (issue: ForumIssue) => (
    <View key={issue.id} style={[
      styles.forumItem, 
      issue.isOpen && styles.openItem,
      !issue.isOpen && styles.closedItem
    ]}>
      <View style={styles.itemHeader}>
        <View style={styles.locationCustomer}>
          <View style={styles.titleRow}>
            <Ionicons 
              name={getCategoryIcon(issue.category) as any} 
              size={16} 
              color="#1a237e" 
              style={styles.categoryIcon} 
            />
            <Text style={[
              styles.itemTitle, 
              !issue.isOpen && styles.closedTitle
            ]}>
              {issue.location}
            </Text>
          </View>
          <Text style={styles.customerName}>
            by {issue.customerName} • {issue.accountNumber}
          </Text>
          <Text style={styles.dateReported}>
            Reported: {new Date(issue.dateReported).toLocaleDateString('en-ZA')}
          </Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(issue.priority) }]}>
            <Text style={styles.priorityText}>{issue.priority}</Text>
          </View>
          {!issue.isOpen && (
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#4caf50" />
              <Text style={styles.statusText}>Resolved</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[
        styles.issue, 
        !issue.isOpen && styles.closedIssue
      ]}>
        {issue.issue}
      </Text>
      
      {issue.responses.length > 0 && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>
            {issue.responses.length === 1 ? 'Response' : `Responses (${issue.responses.length})`}:
          </Text>
          {issue.responses.slice(-2).map((response, index) => (
            <View key={response.id} style={styles.responseItem}>
              <View style={styles.responseHeader}>
                <Text style={styles.technicianName}>{response.technicianName}</Text>
                <Text style={styles.responseTime}>{response.timestamp}</Text>
              </View>
              <Text style={styles.response}>{response.message}</Text>
            </View>
          ))}
          {issue.responses.length > 2 && (
            <Text style={styles.moreResponses}>
              +{issue.responses.length - 2} earlier responses
            </Text>
          )}
        </View>
      )}
      
      {issue.isOpen && (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleRespondToForum(issue)}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Respond to Issue</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="chatbubbles" size={24} color="#23ced4ff" />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('./(auth)/login')}>
          <Ionicons name="log-out-outline" size={24} color="#23ced4ff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'open' && styles.activeTab]}
          onPress={() => setActiveTab('open')}
        >
          <Text style={[styles.tabText, activeTab === 'open' && styles.activeTabText]}>
            Open Issues ({openIssues.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'closed' && styles.activeTab]}
          onPress={() => setActiveTab('closed')}
        >
          <Text style={[styles.tabText, activeTab === 'closed' && styles.activeTabText]}>
            Resolved ({closedIssues.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'open' ? (
          <>
            {openIssues.map(renderIssueCard)}
            {openIssues.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={64} color="#4caf50" />
                <Text style={styles.emptyStateText}>No Open Issues</Text>
                <Text style={styles.emptyStateSubtext}>All forum issues have been resolved</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {closedIssues.map(renderIssueCard)}
            {closedIssues.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="folder-open-outline" size={64} color="#999" />
                <Text style={styles.emptyStateText}>No Resolved Issues</Text>
                <Text style={styles.emptyStateSubtext}>Resolved issues will appear here</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Response Modal */}
      <Modal
        visible={showResponseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Respond to Issue</Text>
              <TouchableOpacity onPress={() => setShowResponseModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedIssue && (
              <ScrollView style={styles.issueDetails}>
                <View style={styles.issueCard}>
                  <Text style={styles.modalIssueTitle}>{selectedIssue.location}</Text>
                  <Text style={styles.modalCustomer}>
                    {selectedIssue.customerName} • {selectedIssue.accountNumber}
                  </Text>
                  <Text style={styles.modalIssueText}>{selectedIssue.issue}</Text>
                  
                  {selectedIssue.responses.length > 0 && (
                    <View style={styles.previousResponses}>
                      <Text style={styles.previousResponsesTitle}>Previous Responses:</Text>
                      {selectedIssue.responses.map((response) => (
                        <View key={response.id} style={styles.previousResponse}>
                          <Text style={styles.previousResponseAuthor}>
                            {response.technicianName} - {response.timestamp}
                          </Text>
                          <Text style={styles.previousResponseText}>{response.message}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.responseSection}>
                  <Text style={styles.responseInputLabel}>Your Response *</Text>
                  <TextInput
                    style={styles.responseInput}
                    value={responseText}
                    onChangeText={setResponseText}
                    placeholder="Provide a detailed response including troubleshooting steps, solutions, or next actions..."
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowResponseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitResponse}
              >
                <Text style={styles.submitButtonText}>Submit Response</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

     
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
    backgroundColor: '#23ced4ff',
    padding: 0,
    paddingTop: Platform.OS === 'android' ? 0 : 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  logoutButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1a237e',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#1a237e',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  forumItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  openItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#09ae48ff',
  },
  closedItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    backgroundColor: '#f9f9f9',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationCustomer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 6,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  closedTitle: {
    color: '#666',
  },
  customerName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  dateReported: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  badges: {
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#4caf50',
    marginLeft: 2,
    fontWeight: '600',
  },
  issue: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    lineHeight: 22,
  },
  closedIssue: {
    color: '#777',
  },
  responseContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 8,
  },
  responseItem: {
    marginBottom: 8,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  technicianName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
  },
  responseTime: {
    fontSize: 11,
    color: '#888',
  },
  response: {
    fontSize: 14,
    color: '#555',
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#4caf50',
  },
  moreResponses: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#0033a0',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
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
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  issueDetails: {
    flex: 1,
    padding: 20,
  },
  issueCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalIssueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  modalCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  modalIssueText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  previousResponses: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  previousResponsesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 8,
  },
  previousResponse: {
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#09ae48ff',
  },
  previousResponseAuthor: {
    fontSize: 12,
    color: '#09ae48ff',
    fontWeight: '600',
    marginBottom: 2,
  },
  previousResponseText: {
    fontSize: 14,
    color: '#555',
  },
  responseSection: {
    flex: 1,
  },
  responseInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#0033a0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default ForumsPage;