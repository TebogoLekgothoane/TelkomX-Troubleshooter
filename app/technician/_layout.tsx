import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import your screen components
import TechnicianDashboard from '../technician/techniciandashboard';
import TechnicianForums from '../technician/technicianforums';
import TechnicianOutages from '../technician/technicianoutages';
import NotificationPage from '../technician/notificationspage';

const Tab = createBottomTabNavigator();

export default function TechnicianLayout() {
  const router = useRouter();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#0033a0',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#33d170e8',
        tabBarInactiveTintColor: '#fff',
      })}
    >
      <Tab.Screen
        name="techniciandashboard"
        component={TechnicianDashboard}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={28} 
              color={focused ? "#4CAF50" : "#fff"} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="technicianforums"
        component={TechnicianForums}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "chatbubbles" : "chatbubbles-outline"} 
              size={28} 
              color={focused ? "#33d170e8" : "#fff"} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="technicianoutages"
        component={TechnicianOutages}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name="warning" 
              size={28} 
              color={focused ? "#4CAF50" : "#fff"} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="notificationpage"
        component={NotificationPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "notifications" : "notifications-outline"} 
              size={28} 
              color={focused ? "#33d170e8" : "#fff"} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}