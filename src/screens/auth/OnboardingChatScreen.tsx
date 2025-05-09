import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { observer } from "mobx-react-lite";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { apiService } from "../../services/api";
import { Input, Button, Text } from "@rneui/themed";
import type { OnboardingResponse } from "../../types";

const ONBOARDING_QUESTIONS = [
  "Hi! I'm here to help you create your dating profile. What's your name?",
  "Great! What's your age?",
  "Tell me a bit about yourself. What are your interests and hobbies?",
  "What are you looking for in a potential match?",
  "What are your top 3 personality traits?",
  "Perfect! I'll create your profile based on your responses. Would you like to see your matches now?",
];

interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const OnboardingChatScreen = observer(({ navigation }: any) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: ONBOARDING_QUESTIONS[0],
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setInputText("");

    if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
      // Add AI response
      const nextQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex + 1];
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: nextQuestion,
        isAI: true,
        timestamp: new Date(),
      };
      setMessages((previousMessages) => [...previousMessages, aiMessage]);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Process final response and submit onboarding data
      setIsProcessing(true);
      try {
        const responses = messages
          .filter((msg) => !msg.isAI)
          .map((msg) => msg.text);

        const onboardingData = {
          name: responses[0],
          age: parseInt(responses[1], 10),
          bio: responses[2],
          interests: responses[3].split(",").map((s) => s.trim()),
          traits: responses[4].split(",").map((s) => s.trim()),
        };

        const result = await apiService.onboarding.submit(onboardingData);
        navigation.replace("MainTabs");
      } catch (error) {
        console.error("Error submitting onboarding data:", error);
        // Handle error appropriately
      } finally {
        setIsProcessing(false);
      }
    }
  }, [currentQuestionIndex, messages, navigation, inputText]);

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isAI ? styles.aiMessage : styles.userMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <Input
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
        />
        <Button
          onPress={handleSend}
          icon={<Ionicons name="send" size={24} color={colors.white} />}
          buttonStyle={styles.sendButton}
          disabled={!inputText.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.gray[100],
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});

export default OnboardingChatScreen;
