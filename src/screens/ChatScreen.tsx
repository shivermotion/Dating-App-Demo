import React, { useState } from "react";
import {
  Box,
  Text,
  ScrollView,
  Image,
  HStack,
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
  Pressable,
} from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { store } from "../store";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { Platform } from "react-native";

// Placeholder images for chat
const CHAT_IMAGES = {
  user: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
  match:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
};

const ChatScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Chat">>();
  const [message, setMessage] = useState("");

  // Check if we're in a specific chat or the tab view
  const isSpecificChat = route.params?.matchId && route.params?.matchName;
  const matchId = route.params?.matchId;
  const matchName = route.params?.matchName;

  const dummyMessages = [
    {
      id: "1",
      senderId: "match",
      text: "Hey! I noticed we both love hiking. Have you been to any good trails lately?",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      senderId: "user",
      text: "Hi! Yes, I actually just got back from a great hike at Mount Tam. The views were incredible!",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      senderId: "match",
      text: "That sounds amazing! I've been meaning to check out Mount Tam. Any recommendations for the best trail?",
      timestamp: new Date(Date.now() - 3400000),
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Implement message sending
      setMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // If we're in the tab view, show a list of chats
  if (!isSpecificChat) {
    return (
      <SafeAreaView className="flex-1 bg-background-50">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 100 : 80,
          }}
        >
          <Box className="p-4">
            {store.matches.map((match) => (
              <Pressable
                key={match.id}
                onPress={() =>
                  navigation.navigate("Chat", {
                    matchId: match.id,
                    matchName: match.name,
                  })
                }
                className="mb-4"
              >
                <Box className="bg-white rounded-xl p-4">
                  <HStack space="sm" className="items-center">
                    <Image
                      source={{ uri: match.photos[0] }}
                      className="w-12 h-12 rounded-full"
                      alt={match.name}
                    />
                    <VStack flex={1}>
                      <Text className="text-lg font-semibold">
                        {match.name}
                      </Text>
                      <Text className="text-gray-500 text-sm" numberOfLines={1}>
                        {dummyMessages[0].text}
                      </Text>
                    </VStack>
                    <Text className="text-gray-400 text-xs">
                      {formatTime(dummyMessages[0].timestamp)}
                    </Text>
                  </HStack>
                </Box>
              </Pressable>
            ))}
          </Box>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <Box className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 100 : 80,
          }}
        >
          {dummyMessages.map((msg) => (
            <Box
              key={msg.id}
              className={`mb-4 ${
                msg.senderId === "user" ? "items-end" : "items-start"
              }`}
            >
              <HStack
                space="sm"
                className={`${
                  msg.senderId === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Image
                  source={{
                    uri:
                      msg.senderId === "user"
                        ? CHAT_IMAGES.user
                        : CHAT_IMAGES.match,
                  }}
                  className="w-8 h-8 rounded-full"
                  alt={msg.senderId === "user" ? "You" : matchName}
                />
                <VStack
                  className={`${
                    msg.senderId === "user"
                      ? "bg-primary-500 rounded-2xl rounded-tr-none"
                      : "bg-gray-200 rounded-2xl rounded-tl-none"
                  } px-4 py-2 max-w-[80%]`}
                >
                  <Text
                    className={`${
                      msg.senderId === "user" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      msg.senderId === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </ScrollView>

        <Box className="p-4 border-t border-gray-200 bg-white">
          <HStack space="sm" className="items-center">
            <Input
              flex={1}
              variant="outline"
              size="md"
              className="bg-gray-100 border-0 rounded-full"
            >
              <InputField
                placeholder="Type a message..."
                value={message}
                onChangeText={setMessage}
              />
            </Input>
            <Button
              variant="solid"
              action="primary"
              className="bg-primary-500 rounded-full w-12 h-12"
              onPress={handleSend}
            >
              <ButtonText className="text-white">→</ButtonText>
            </Button>
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

ChatScreen.displayName = "ChatScreen";

export const ChatScreenObserver = observer(ChatScreen);
