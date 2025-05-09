import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingChatScreen from "../screens/auth/OnboardingChatScreen";
import ChatScreen from "../screens/main/ChatScreen";

export type MainStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Chat: { matchId: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingChatScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Chat",
          headerBackTitle: "Back",
          headerBackVisible: true,
        })}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
