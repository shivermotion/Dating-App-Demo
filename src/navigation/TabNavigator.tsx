import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MatchesScreenObserver } from "../screens/MatchesScreen";
import { ChatScreenObserver } from "../screens/ChatScreen";
import { ProfileScreenObserver } from "../screens/ProfileScreen";
import { Box, Text } from "@gluestack-ui/themed";

export type TabParamList = {
  Matches: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#6b7280",
      }}
    >
      <Tab.Screen
        name="Matches"
        component={MatchesScreenObserver}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Matches</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreenObserver}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Chat</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenObserver}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12 }}>Profile</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
