import React, { useState } from "react";
import { Box, Text, Input, Button, ScrollView } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { store } from "../store";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

const OnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI dating assistant. Let's create your profile together. What's your name?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Great! Now, tell me a bit about yourself. What are your interests and hobbies?",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Create user profile after a few messages
      if (messages.length >= 4) {
        store.setUser({
          id: "1",
          name: userMessage.text,
          age: 28,
          bio: "Passionate about technology, music, and exploring new places. Always up for a good conversation over coffee.",
          interests: [
            "Technology",
            "Music",
            "Travel",
            "Coffee",
            "Photography",
            "Hiking",
          ],
          photos: ["https://placekitten.com/400/400"],
          personalityTraits: [
            "Adventurous",
            "Creative",
            "Empathetic",
            "Intellectual",
          ],
          location: {
            city: "San Francisco",
            country: "USA",
          },
        });
        navigation.replace("Main");
      }
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <Box className="flex-1 p-4">
        <ScrollView className="flex-1 mb-4">
          {messages.map((message) => (
            <Box
              key={message.id}
              className={`mb-4 p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary-100 self-end"
                  : "bg-secondary-100 self-start"
              }`}
              style={{ maxWidth: "80%" }}
            >
              <Text
                className={
                  message.sender === "user"
                    ? "text-primary-900"
                    : "text-secondary-900"
                }
              >
                {message.text}
              </Text>
            </Box>
          ))}
        </ScrollView>
        <Box className="flex-row items-center">
          <Input flex={1} className="mr-2">
            <Input.Input
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              onSubmitEditing={handleSend}
            />
          </Input>
          <Button onPress={handleSend} disabled={!input.trim()}>
            <Text className="text-white">Send</Text>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

OnboardingScreen.displayName = "OnboardingScreen";

export const OnboardingScreenObserver = observer(OnboardingScreen);
