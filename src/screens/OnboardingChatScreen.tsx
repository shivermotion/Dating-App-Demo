import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { GiftedChat, IMessage, Bubble, Send } from "react-native-gifted-chat";
import { observer } from "mobx-react-lite";
import { colors } from "../theme/colors";
import { onboardingStore } from "../store/onboardingStore";

const ONBOARDING_QUESTIONS = [
  "What are you passionate about?",
  "Describe your ideal weekend.",
  "What qualities do you value most in a partner?",
  "What's your favorite way to spend time with someone?",
  "What are your long-term goals?",
  "What makes you unique?",
  "What's your approach to relationships?",
  "What are you looking for in a dating app?",
];

const OnboardingChatScreen = observer(({ navigation }: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    // Add initial bot message
    setMessages([
      {
        _id: 1,
        text:
          "Hi! I'm your AI matchmaker. Let's get to know you better. " +
          ONBOARDING_QUESTIONS[0],
        createdAt: new Date(),
        user: { _id: 2, name: "AI Matchmaker" },
      },
    ]);
  }, []);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      // Store the answer
      onboardingStore.setAnswer(
        currentQuestionIndex.toString(),
        newMessages[0].text
      );

      // If this was the last question, generate profile
      if (currentQuestionIndex === ONBOARDING_QUESTIONS.length - 1) {
        try {
          await onboardingStore.generateProfile();
          navigation.replace("MainTabs");
        } catch (error) {
          // Error is handled by the store
        }
        return;
      }

      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      // Add bot's next question
      setTimeout(() => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Date.now(),
              text: ONBOARDING_QUESTIONS[nextIndex],
              createdAt: new Date(),
              user: { _id: 2, name: "AI Matchmaker" },
            },
          ])
        );
      }, 1000);
    },
    [currentQuestionIndex, navigation]
  );

  if (onboardingStore.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: colors.primary,
              },
              left: {
                backgroundColor: colors.gray[200],
              },
            }}
          />
        )}
        renderSend={(props) => (
          <Send {...props} containerStyle={styles.sendContainer} />
        )}
        alwaysShowSend
        scrollToBottom
      />
    </View>
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
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15,
  },
});

export default OnboardingChatScreen;
