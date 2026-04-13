
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ServiceOutagesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Service Outages</Text>
      </View>

      {/* Outage Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Outages</Text>
        <View style={[styles.notification, { borderLeftColor: '#d32f2f', borderLeftWidth: 4 }]}>
          <Ionicons name="alert-circle-outline" size={22} color="#d32f2f" />
          <Text style={styles.notificationText}>Internet outage in Johannesburg area due to fiber cable damage. Estimated resolution: 2 hours.</Text>
        </View>
        <View style={[styles.notification, { borderLeftColor: '#388e3c', borderLeftWidth: 4 }]}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#388e3c" />
          <Text style={styles.notificationText}>All other services running smoothly. No additional outages reported ✅</Text>
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
        <Text style={styles.footerText}>Last updated: September 17, 2025 · Powered by TelkomX AI</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0033a0',
    padding: 30,
    borderRadius: 12,
    marginBottom: 16,
  },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#3949ab' },

  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  notificationText: { marginLeft: 8, color: '#333', flexShrink: 1 },

  mapPlaceholder: {
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#666', fontWeight: '600' },

  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#33d170e8',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  reportText: { marginLeft: 8, fontWeight: '600', color: '#fff' },

  footer: { alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 12, color: '#888', textAlign: 'center' },
});

export default ServiceOutagesScreen;
