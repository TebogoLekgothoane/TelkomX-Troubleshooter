import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import your screen components
import AgentQueue from '../agent/agentdashboard';
import AgentTickets from '../agent/tickets';
import Notifications from '../agent/notificationspage';

const Tab = createBottomTabNavigator();

export default function AgentLayout() {
  const router = useRouter();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#3949ab',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 9,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#2196F3', // Blue theme for agents
        tabBarInactiveTintColor: '#fff',
      })}
    >
         <Tab.Screen
        name="agentdashboard"
        component={AgentQueue}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "list" : "list-outline"} 
              size={28} 
              color={focused ? "#09ae48ff" : "#fff"} 
            />
          ),
        }}
      />
      
     
    
       <Tab.Screen
        name="agentqueue"
        component={AgentTickets}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? "assignment" : "assignment"} 
              size={28} 
              color={focused ? "#09ae48ff" : "#fff"} 
            />
          ),
        }}
      />
     
  
      
      <Tab.Screen
        name="notifications"
        component={Notifications}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "notifications" : "notifications-outline"} 
              size={28} 
              color={focused ? "#09ae48ff" : "#fff"} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}