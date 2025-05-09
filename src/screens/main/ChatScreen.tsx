import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { observer } from "mobx-react-lite";
import { rootStore } from "../../store";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import type { Message } from "../../types";
import { apiService } from "../../services/api";
import { Input, Button } from "@rneui/themed";

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  sender?: {
    name: string;
    profileImage?: string;
  };
}

const ChatScreen = observer(({ route, navigation }: any) => {
  const matchId = route?.params?.matchId;
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (!matchId) {
      navigation.goBack();
      return;
    }

    rootStore.match.loadMessages(matchId);
    loadSuggestion();
  }, [matchId, navigation]);

  const loadSuggestion = async () => {
    if (!matchId) return;

    try {
      const response = await apiService.users.getSuggestion();
      setSuggestion(response.text);
    } catch (error) {
      console.error("Error loading suggestion:", error);
    }
  };

  const handleSend = async () => {
    if (!matchId || !inputText.trim()) return;

    await rootStore.match.sendMessage(matchId, inputText.trim());
    setInputText("");
    setSuggestion(null);
  };

  const formatMessages = (messages: Message[]): ChatMessage[] => {
    return messages.map((message) => ({
      id: message.id,
      text: message.text,
      timestamp: new Date(message.timestamp),
      senderId: message.senderId,
      sender: {
        name: message.sender?.name || "Unknown",
        profileImage: message.sender?.profileImage,
      },
    }));
  };

  if (!matchId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Invalid chat room</Text>
      </View>
    );
  }

  if (rootStore.match.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (rootStore.match.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{rootStore.match.error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {suggestion && (
        <TouchableOpacity
          style={styles.suggestionContainer}
          onPress={() => {
            setInputText(suggestion);
            handleSend();
          }}
        >
          <Ionicons name="bulb-outline" size={20} color={colors.primary} />
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={styles.messagesContainer}>
        {formatMessages(rootStore.match.messages).map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.senderId === "current-user"
                ? styles.userMessage
                : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: "center",
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[100],
    padding: 12,
    margin: 8,
    borderRadius: 12,
    gap: 8,
  },
  suggestionText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
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
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.gray[100],
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    alignSelf: "flex-end",
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

export default ChatScreen;
