// technician/technicianoutages.tsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Outage = {
  id: string;
  location: string;
  description: string;
  affectedUsers: number;
  status: 'Active' | 'Under Investigation' | 'Resolved';
  reportedAt: Date;
};

const OutagesPage: React.FC = () => {
  const [outages, setOutages] = useState<Outage[]>([]);

  useEffect(() => {
    loadOutagesData();
  }, []);

  const loadOutagesData = () => {
    const mockOutages: Outage[] = [
      {
        id: 'o1',
        location: 'Pretoria',
        description: 'Fiber line damage due to construction',
        affectedUsers: 150,
        status: 'Under Investigation',
        reportedAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'o2',
        location: 'Bloemfontein',
        description: 'Power surge affecting modems',
        affectedUsers: 45,
        status: 'Active',
        reportedAt: new Date(Date.now() - 7200000),
      },
      {
        id: 'o3',
        location: 'Cape Town',
        description: 'Network maintenance affecting CBD area',
        affectedUsers: 89,
        status: 'Under Investigation',
        reportedAt: new Date(Date.now() - 5400000),
      },
      {
        id: 'o4',
        location: 'Durban',
        description: 'Router configuration issues',
        affectedUsers: 23,
        status: 'Active',
        reportedAt: new Date(Date.now() - 1800000),
      },
    ];
    setOutages(mockOutages);
  };

  const handleUpdateOutageStatus = (outageId: string, newStatus: Outage['status']) => {
    setOutages(prev => prev.map(o => o.id === outageId ? { ...o, status: newStatus } : o));
  };

  const renderOutageItem = ({ item }: { item: Outage }) => (
    <View style={styles.outageItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.location}</Text>
        <Text style={[styles.status, { color: item.status === 'Resolved' ? '#388e3c' : item.status === 'Under Investigation' ? '#f57c00' : '#d32f2f' }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.issue}>{item.description}</Text>
      <Text style={styles.affected}>Affected Users: {item.affectedUsers}</Text>
      {item.status !== 'Resolved' && (
        <View style={styles.ticketActions}>
          <TouchableOpacity
            style={[styles.statusButton, styles.inProgressButton]}
            onPress={() => handleUpdateOutageStatus(item.id, 'Under Investigation')}
          >
            <Text style={styles.buttonText}>Investigate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusButton, styles.resolveButton]}
            onPress={() => handleUpdateOutageStatus(item.id, 'Resolved')}
          >
            <Text style={styles.buttonText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const activeOutages = outages.filter(o => o.status !== 'Resolved');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('./(auth)/')}>
          <Ionicons name="log-out-outline" size={24} color="#23ced4ff" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.titleSection}>
        <MaterialIcons name="warning" size={28} color="#d32f2f" />
        <Text style={styles.pageTitle}>Active Outages ({activeOutages.length})</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeOutages.map((outage) => (
          <View key={outage.id} style={styles.outageItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{outage.location}</Text>
              <Text style={[styles.status, { color: outage.status === 'Resolved' ? '#388e3c' : outage.status === 'Under Investigation' ? '#f57c00' : '#d32f2f' }]}>
                {outage.status}
              </Text>
            </View>
            <Text style={styles.issue}>{outage.description}</Text>
            <Text style={styles.affected}>Affected Users: {outage.affectedUsers}</Text>
            {outage.status !== 'Resolved' && (
              <View style={styles.ticketActions}>
                <TouchableOpacity
                  style={[styles.statusButton, styles.inProgressButton]}
                  onPress={() => handleUpdateOutageStatus(outage.id, 'Under Investigation')}
                >
                  <Text style={styles.buttonText}>Investigate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusButton, styles.resolveButton]}
                  onPress={() => handleUpdateOutageStatus(outage.id, 'Resolved')}
                >
                  <Text style={styles.buttonText}>Resolve</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {activeOutages.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="check-circle" size={64} color="#388e3c" />
            <Text style={styles.emptyStateText}>No Active Outages</Text>
            <Text style={styles.emptyStateSubtext}>All systems are running normally</Text>
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
    paddingTop: Platform.OS === 'android' ? 0 : 16,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  outageItem: {
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
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  issue: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
  },
  affected: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
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
    backgroundColor: '#33d170e8',
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

export default OutagesPage;