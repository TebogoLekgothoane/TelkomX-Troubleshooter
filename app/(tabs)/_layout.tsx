
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components copy/HapticTab';
import { IconSymbol } from '@/components copy/ui/IconSymbol';
import TabBarBackground from '@/components copy/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#71bf44',
        tabBarInactiveTintColor: '#fff',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0033a0',
          borderTopWidth: 0,
          height: 50,
          paddingBottom: 9,
          paddingTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={28} 
              color={focused ? "#71bf44" : "#fff"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="communityforum"
        options={{
          title: 'Community Forum',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "chatbubbles" : "chatbubbles-outline"} 
              size={28} 
              color={focused ? "#71bf44" : "#fff"} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "paper-plane" : "paper-plane-outline"} 
              size={28} 
              color={focused ? "#71bf44" : "#fff"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          title: 'Queue',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={28} 
              color={focused ? "#71bf44" : "#fff"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"} 
              size={28} 
              color={focused ? "#71bf44" : "#fff"} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
