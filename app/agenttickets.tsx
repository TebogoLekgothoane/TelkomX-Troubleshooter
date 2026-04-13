// AgentCallPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  TextInput, 
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Technician {
  id: string;
  name: string;
  specialization: string;
  availability: 'Available' | 'Busy' | 'Offline';
  rating: number;
}

interface CallNote {
  id: string;
  timestamp: string;
  content: string;
  type: 'agent' | 'system';
}

const AgentCallPage: React.FC = () => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [notes, setNotes] = useState('');
  const [callNotes, setCallNotes] = useState<CallNote[]>([]);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [callStatus, setCallStatus] = useState<'active' | 'hold' | 'ended'>('active');

  // Mock customer data - Enhanced with more details
  const customer = {
    name: 'Lerato M.',
    phoneNumber: '+27 11 123 4567',
    accountNumber: 'TK001234567',
    issue: 'Slow internet speeds',
    priority: 'High',
    diagnostics: 'Ping to gateway: 15ms (OK). DNS: 8ms (OK). Signal: -75dBm (Weak). Download: 2.1Mbps (Expected: 20Mbps)',
    previousCalls: 2,
    serviceType: 'Fiber 20Mbps',
    location: 'Johannesburg, Gauteng'
  };

  // Mock technicians data
  const technicians: Technician[] = [
    { id: '1', name: 'Sipho Ndaba', specialization: 'Fiber Connectivity', availability: 'Available', rating: 4.8 },
    { id: '2', name: 'Thandiwe Mthembu', specialization: 'Network Infrastructure', availability: 'Available', rating: 4.9 },
    { id: '3', name: 'Johan van der Merwe', specialization: 'Equipment Diagnostics', availability: 'Busy', rating: 4.7 },
    { id: '4', name: 'Nomsa Khumalo', specialization: 'Signal Optimization', availability: 'Available', rating: 4.6 },
  ];

  // Timer effect - Fixed the useState error
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (callStatus === 'active') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  // Auto-save notes every 10 seconds
  useEffect(() => {
    if (notes.trim()) {
      const timer = setTimeout(() => {
        addCallNote(notes, 'agent');
        setNotes('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notes]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addCallNote = (content: string, type: 'agent' | 'system' = 'agent') => {
    const newNote: CallNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      content: content.trim(),
      type
    };
    setCallNotes(prev => [...prev, newNote]);
  };

  const handleSaveNote = () => {
    if (notes.trim()) {
      addCallNote(notes, 'agent');
      setNotes('');
      Alert.alert('Success', 'Note saved successfully');
    }
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call', 
      'Are you sure you want to end the call? Make sure to resolve or escalate the issue first.', 
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: () => {
            setCallStatus('ended');
            addCallNote('Call ended by agent', 'system');
            // In a real app, this would save all data to backend
            setTimeout(() => router.back(), 1000);
          },
        },
      ]
    );
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    addCallNote(`Call ${!isMuted ? 'muted' : 'unmuted'}`, 'system');
  };

  const handleHold = () => {
    const newHoldState = !isOnHold;
    setIsOnHold(newHoldState);
    setCallStatus(newHoldState ? 'hold' : 'active');
    addCallNote(`Call ${newHoldState ? 'placed on hold' : 'resumed'}`, 'system');
  };

  const handleResolve = () => {
    setShowResolutionModal(true);
  };

  const confirmResolution = () => {
    if (!resolutionSummary.trim()) {
      Alert.alert('Error', 'Please provide a resolution summary');
      return;
    }

    addCallNote(`Issue resolved: ${resolutionSummary}`, 'system');
    setShowResolutionModal(false);
    
    Alert.alert(
      'Issue Resolved', 
      'The issue has been marked as resolved. The call will now end.',
      [
        {
          text: 'OK',
          onPress: () => {
            setCallStatus('ended');
            setTimeout(() => router.back(), 1000);
          },
        },
      ]
    );
  };

  const handleEscalate = () => {
    setShowTechnicianModal(true);
  };

  const confirmEscalation = () => {
    if (!selectedTechnician) {
      Alert.alert('Error', 'Please select a technician');
      return;
    }

    addCallNote(`Issue escalated to ${selectedTechnician.name} (${selectedTechnician.specialization})`, 'system');
    setShowTechnicianModal(false);
    
    Alert.alert(
      'Issue Escalated', 
      `The issue has been escalated to ${selectedTechnician.name}. They will contact the customer within 30 minutes.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCallStatus('ended');
            setTimeout(() => router.back(), 1000);
          },
        },
      ]
    );
  };

  const handleOpenBooking = () => {
    router.push('/agent/agentdashboard');
  };

  const renderTechnician = ({ item }: { item: Technician }) => (
    <TouchableOpacity
      style={[
        styles.technicianItem,
        selectedTechnician?.id === item.id && styles.selectedTechnician,
        item.availability !== 'Available' && styles.unavailableTechnician
      ]}
      onPress={() => item.availability === 'Available' ? setSelectedTechnician(item) : null}
      disabled={item.availability !== 'Available'}
    >
      <View style={styles.technicianInfo}>
        <Text style={styles.technicianName}>{item.name}</Text>
        <Text style={styles.technicianSpec}>{item.specialization}</Text>
        <View style={styles.technicianMeta}>
          <Text style={[
            styles.availability,
            { color: item.availability === 'Available' ? '#4caf50' : item.availability === 'Busy' ? '#ff9800' : '#f44336' }
          ]}>
            {item.availability}
          </Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCallNote = ({ item }: { item: CallNote }) => (
    <View style={[styles.noteItem, item.type === 'system' && styles.systemNote]}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTimestamp}>{item.timestamp}</Text>
        <Text style={styles.noteType}>{item.type === 'system' ? 'System' : 'Agent'}</Text>
      </View>
      <Text style={styles.noteContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.statusIndicator, callStatus === 'hold' && styles.holdStatus]} />
            <Text style={styles.title}>
              {callStatus === 'hold' ? 'On Hold - ' : callStatus === 'ended' ? 'Call Ended - ' : 'Connected to '} 
              {customer.name}
            </Text>
            <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
            <Text style={styles.phoneNumber}>{customer.phoneNumber}</Text>
          </View>

          {/* Enhanced Customer Info */}
          <View style={styles.customerInfo}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.customerRow}>
              <Text style={styles.label}>Account:</Text>
              <Text style={styles.value}>{customer.accountNumber}</Text>
            </View>
            <View style={styles.customerRow}>
              <Text style={styles.label}>Service:</Text>
              <Text style={styles.value}>{customer.serviceType}</Text>
            </View>
            <View style={styles.customerRow}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{customer.location}</Text>
            </View>
            <View style={styles.customerRow}>
              <Text style={styles.label}>Previous Calls:</Text>
              <Text style={styles.value}>{customer.previousCalls}</Text>
            </View>
            
            <Text style={styles.sectionSubtitle}>Current Issue</Text>
            <Text style={styles.issue}>{customer.issue}</Text>
            <Text style={styles.diagnostics}>{customer.diagnostics}</Text>
            <Text style={[styles.priority, { color: customer.priority === 'High' ? '#f44336' : '#ff9800' }]}>
              Priority: {customer.priority}
            </Text>
          </View>

          {/* Call Controls */}
          <View style={styles.callControls}>
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.activeControl]} 
              onPress={handleMute}
            >
              <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color="#fff" />
              <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, isOnHold && styles.activeControl]} 
              onPress={handleHold}
            >
              <Ionicons name={isOnHold ? 'play' : 'pause'} size={24} color="#fff" />
              <Text style={styles.controlLabel}>{isOnHold ? 'Resume' : 'Hold'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.endButton]} 
              onPress={handleEndCall}
            >
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.controlLabel}>End Call</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleResolve}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Resolve Issue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.escalateButton]} onPress={handleEscalate}>
              <Ionicons name="arrow-up-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Escalate to Tech</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.bookingButton]} onPress={handleOpenBooking}>
              <Ionicons name="calendar" size={20} color="#fff" />
              <Text style={styles.buttonText}>Open Booking Slot</Text>
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Call Notes</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter detailed notes about the call, troubleshooting steps, customer responses..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.saveNoteButton} onPress={handleSaveNote}>
              <Text style={styles.saveNoteText}>Save Note</Text>
            </TouchableOpacity>

            {/* Call History */}
            {callNotes.length > 0 && (
              <View style={styles.callHistory}>
                <Text style={styles.sectionSubtitle}>Call History</Text>
                <FlatList
                  data={callNotes}
                  renderItem={renderCallNote}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Technician Selection Modal */}
        <Modal visible={showTechnicianModal} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Technician</Text>
              <TouchableOpacity onPress={() => setShowTechnicianModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={technicians}
              renderItem={renderTechnician}
              keyExtractor={(item) => item.id}
              style={styles.technicianList}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowTechnicianModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmEscalation}
              >
                <Text style={styles.confirmButtonText}>Escalate</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Resolution Modal */}
        <Modal visible={showResolutionModal} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resolve Issue</Text>
              <TouchableOpacity onPress={() => setShowResolutionModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.resolutionContent}>
              <Text style={styles.label}>Resolution Summary *</Text>
              <TextInput
                style={styles.resolutionInput}
                value={resolutionSummary}
                onChangeText={setResolutionSummary}
                placeholder="Describe how the issue was resolved, steps taken, and any follow-up required..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowResolutionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmResolution}
              >
                <Text style={styles.confirmButtonText}>Mark Resolved</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  holdStatus: {
    backgroundColor: '#ff9800',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
  },
  duration: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  customerInfo: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3949ab',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3949ab',
    marginTop: 16,
    marginBottom: 8,
  },
  issue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  diagnostics: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  priority: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  activeControl: {
    backgroundColor: '#ff9800',
  },
  endButton: {
    backgroundColor: '#f44336',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 12,
    flexBasis: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
  },
  escalateButton: {
    backgroundColor: '#ff9800',
  },
  bookingButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  notesSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    minHeight: 100,
  },
  saveNoteButton: {
    backgroundColor: '#3949ab',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveNoteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  callHistory: {
    marginTop: 20,
  },
  noteItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  systemNote: {
    backgroundColor: '#e3f2fd',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  noteType: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
  technicianList: {
    flex: 1,
    padding: 20,
  },
  technicianItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTechnician: {
    borderColor: '#3949ab',
    backgroundColor: '#e8eaf6',
  },
  unavailableTechnician: {
    opacity: 0.6,
  },
  technicianInfo: {
    flex: 1,
  },
  technicianName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  technicianSpec: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  technicianMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availability: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 12,
    color: '#666',
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
  confirmButton: {
    backgroundColor: '#3949ab',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resolutionContent: {
    flex: 1,
    padding: 20,
  },
  resolutionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    minHeight: 150,
    marginTop: 8,
  },
});

export default AgentCallPage;

