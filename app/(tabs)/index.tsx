import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';

// TypeScript interfaces
interface ActiveIssue {
  id: string;
  title: string;
  issue: string;
  technician: string;
  progress: number;
  status: string;
  estimatedCompletion: string;
  description: string;
  priority: string;
  category: string;
}

const HomeScreen = () => {
  const handleLogin = () => {
    router.push('./(auth)/login');
  };

  const handleChatbot = () => {
    router.push('./chatbot'); // Navigate to chatbot page
  };

  // Navigate to ticket details with specific ticket ID
  const handleTicketPress = (ticketId: string) => {
    // Pass the ticket ID as a parameter to the ticket progress page
    router.push({
      pathname: './ticketprogress',
      params: { ticketId: ticketId }
    });
  };

  // Mock data for issue tracking - matches the CustomerTicketProgress data structure
  const activeIssues: ActiveIssue[] = [
    {
      id: 'T-2024-001',
      title: 'Internet Connection Issues',
      issue: 'Internet Connection Issue',
      technician: 'Alex Molefe',
      progress: 60,
      status: 'In Progress',
      estimatedCompletion: '2 hours',
      description: 'Experiencing frequent disconnections and slow speeds during peak hours',
      priority: 'High',
      category: 'Connectivity'
    },
    {
      id: 'T-2024-002', 
      title: 'Router Configuration',
      issue: 'Router Configuration',
      technician: 'Sarah Johnson',
      progress: 30,
      status: 'Diagnosed',
      estimatedCompletion: '4 hours',
      description: 'Router needs reconfiguration for optimal performance',
      priority: 'Medium',
      category: 'Equipment'
    },
    {
      id: 'T-2024-003',
      title: 'Signal Strength Problem',
      issue: 'Signal Strength Problem',
      technician: 'Mike Chen',
      progress: 90,
      status: 'Nearly Complete',
      estimatedCompletion: '30 minutes',
      description: 'Weak signal affecting internet stability',
      priority: 'High',
      category: 'Connectivity'
    }
  ];

  const getProgressColor = (progress: number): string => {
    if (progress >= 75) return '#00A84F';
    if (progress >= 50) return '#FFA500';
    return '#FF6B6B';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'In Progress': return '#0057B8';
      case 'Diagnosed': return '#FFA500';
      case 'Nearly Complete': return '#00A84F';
      default: return '#666';
    }
  };

  const renderIssueCard = (issue: ActiveIssue) => (
    <TouchableOpacity
      key={issue.id}
      style={styles.issueCard}
      onPress={() => handleTicketPress(issue.id)}
      activeOpacity={0.7}
    >
      <View style={styles.issueHeader}>
        <View style={styles.issueInfo}>
          <Text style={styles.issueId}>{issue.id}</Text>
          <Text style={styles.issueTitle}>{issue.title}</Text>
          <Text style={styles.technicianText}>Assigned: {issue.technician}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) }]}>
          <Text style={styles.statusText}>{issue.status}</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={[styles.progressPercentage, { color: getProgressColor(issue.progress) }]}>
            {issue.progress}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${issue.progress}%`, 
                backgroundColor: getProgressColor(issue.progress) 
              }
            ]} 
          />
        </View>
        <View style={styles.estimatedTimeContainer}>
          <Ionicons name="time-outline" size={12} color="#666" />
          <Text style={styles.estimatedTime}>Est. completion: {issue.estimatedCompletion}</Text>
        </View>
      </View>
      
      {/* Click indicator */}
      <View style={styles.clickIndicator}>
        <Text style={styles.clickText}>Tap for details</Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#E6F3FF", "#F8FBFF", "#FFFFFF"]}
      style={styles.gradientBackground}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBanner}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/TelkomSA_Logo.png' }}
              style={styles.logo}
            />
            <Text style={styles.title}>TelkomX Troubleshooter</Text>
            <Text style={styles.subtitle}>Proactive Support at Your Fingertips</Text>
            <TouchableOpacity style={styles.loginIcon} onPress={handleLogin}>
              <Ionicons name="log-in-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={styles.quickCardPrimary}
              onPress={() => router.push('/chatbot')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
              <Text style={styles.cardTextPrimary}>Start Troubleshooting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCardPrimary}
              onPress={() => router.push('./(tabs)/communityforum')}
            >
              <Ionicons name="people-outline" size={28} color="#fff" />
              <Text style={styles.cardTextPrimary}>Community Forum</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Issues Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Support Tickets</Text>
            <TouchableOpacity 
              onPress={() => router.push('./ticketprogress')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color="#0057B8" />
            </TouchableOpacity>
          </View>
          {activeIssues.length > 0 ? (
            activeIssues.map(renderIssueCard)
          ) : (
            <View style={styles.noIssuesContainer}>
              <Ionicons name="checkmark-circle-outline" size={48} color="#00A84F" />
              <Text style={styles.noIssuesTitle}>No Active Issues</Text>
              <Text style={styles.noIssuesSubtitle}>All your services are running smoothly</Text>
            </View>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={[styles.notification, { borderLeftColor: '#00A84F', borderLeftWidth: 4 }]}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#00A84F" />
            <Text style={styles.notificationText}>All systems running smoothly. No active issues detected</Text>
          </View>
        </View>

         <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Outages</Text>
                <View style={[styles.notification, { borderLeftColor: '#d32f2f', borderLeftWidth: 4 }]}>
                  <Ionicons name="alert-circle-outline" size={22} color="#d32f2f" />
                  <Text style={styles.notificationText}>Internet outage in Johannesburg area due to fiber cable damage. Estimated resolution: 2 hours.</Text>
                </View>
                <View style={[styles.notification, { borderLeftColor: '#388e3c', borderLeftWidth: 4 }]}>
                  <Ionicons name="checkmark-circle-outline" size={22} color="#388e3c" />
                  <Text style={styles.notificationText}>All other services running smoothly. No additional outages reported</Text>
                </View>
              </View>
        
              {/* Outage Map Placeholder */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Outage Map</Text>
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.placeholderText}>Interactive Map Coming Soon</Text>
                </View>
              </View>
        
              {/* Report Issue */}
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => router.push('./(tabs)/communityforum')}
              >
                <Ionicons name="alert-outline" size={24} color="#fff" />
                <Text style={styles.reportText}>Report a New Outage</Text>
              </TouchableOpacity>
        

      
  

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by TelkomX AI · Faster Support, Zero Waiting</Text>
        </View>

        {/* Add bottom padding to account for floating chatbot button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Chatbot Button */}
      <TouchableOpacity style={styles.chatbotButton} onPress={handleChatbot}>
        <View style={styles.chatbotButtonContent}>
          <Ionicons name="chatbubbles" size={28} color="#fff" />
          <View style={styles.chatbotBadge}>
            <Text style={styles.chatbotBadgeText}>AI</Text>
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: { flex: 1, padding: 29 },
  header: { alignItems: 'center', marginBottom: 16 },
  headerBanner: {
    width: '100%',
    backgroundColor: '#0033a0',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 9,
  },
  logo: { width: 150, height: 50, marginBottom: 8, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#e0e0e0', marginTop: 4 },
  loginIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#0057B8' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#0057B8',
    fontWeight: '600',
    marginRight: 4,
  },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickCardPrimary: {
    width: '48%',
    backgroundColor: '#0033a0',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTextPrimary: { marginTop: 8, fontWeight: '600', textAlign: 'center', color: '#fff' },

  // Enhanced Issue Tracking Styles
  issueCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D0D7E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  issueInfo: {
    flex: 1,
  },
  issueId: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  technicianText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  progressSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimatedTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  clickIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clickText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },

  // No issues state
  noIssuesContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0D7E0',
  },
  noIssuesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  noIssuesSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0D7E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 8,
  },
  notificationText: { marginLeft: 12, color: '#333', flexShrink: 1 },

  // Outage Map Styles
  mapPlaceholder: {
    backgroundColor: '#f5f5f5',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },

  // Report Button Styles
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  reportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D7E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: { fontWeight: '600', color: '#0057B8' },

  footer: { marginTop: 12, alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 12, color: '#888', textAlign: 'center' },

  // Floating Chatbot Button Styles
  chatbotButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0033a0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatbotButtonContent: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatbotBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatbotBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HomeScreen;