import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { OnboardingScreenObserver } from "../screens/OnboardingScreen";
import { MatchesScreenObserver } from "../screens/MatchesScreen";
import { ChatScreenObserver } from "../screens/ChatScreen";
import { ProfileScreenObserver } from "../screens/ProfileScreen";
import { store } from "../store";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Chat: { matchId: string; matchName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Matches") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Onboarding") {
            iconName = focused ? "create" : "create-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "#6C757D",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: Platform.OS === "ios" ? 88 : 60,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#E9ECEF",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E9ECEF",
        },
        headerTitleStyle: {
          color: "#212529",
          fontSize: 18,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="Matches"
        component={MatchesScreenObserver}
        options={{
          headerShown: true,
          headerTitle: "Discover",
          tabBarLabel: "Matches",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreenObserver}
        options={{
          headerShown: true,
          headerTitle: "Messages",
          tabBarLabel: "Messages",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenObserver}
        options={{
          headerShown: true,
          headerTitle: "Profile",
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Onboarding" component={OnboardingScreenObserver} />
        <Stack.Screen
          name="Chat"
          component={ChatScreenObserver}
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitle: "Back",
            headerStyle: {
              backgroundColor: "#FFFFFF",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

RootNavigator.displayName = "RootNavigator";
