import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { observer } from "mobx-react-lite";
import { rootStore } from "../../store";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "../../navigation/MainStack";

type ChatScreenRouteProp = RouteProp<MainStackParamList, "Chat">;

const ChatScreen = observer(() => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const matchId = route.params?.matchId;
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (matchId) {
      rootStore.match.loadMessages(matchId);
    }
  }, [matchId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await rootStore.match.sendMessage(matchId, message.trim());
      setMessage("");
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.isFromUser;
    const sentiment = item.sentiment || 0;
    const toxicity = item.toxicity || 0;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.userMessage : styles.matchMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMe ? styles.userMessageText : styles.matchMessageText,
          ]}
        >
          {item.text}
        </Text>
        <View style={styles.messageMeta}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          {sentiment !== 0 && (
            <Ionicons
              name={sentiment > 0 ? "happy" : "sad"}
              size={16}
              color={sentiment > 0 ? colors.success : colors.error}
              style={styles.sentimentIcon}
            />
          )}
        </View>
      </View>
    );
  };

  const renderSuggestions = () => {
    if (!rootStore.match.chatSuggestions.length) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>AI Suggestions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {rootStore.match.chatSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => setMessage(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (!matchId) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="chatbubbles-outline"
          size={64}
          color={colors.gray[400]}
        />
        <Text style={styles.emptyText}>Select a match to start chatting</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {rootStore.match.selectedMatch?.user.name}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={rootStore.match.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      {renderSuggestions()}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={message.trim() ? colors.white : colors.gray[400]}
          />
        </TouchableOpacity>
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
  header: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  messagesList: {
    padding: 16,
    gap: 8,
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
  matchMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.gray[200],
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  userMessageText: {
    color: colors.text,
  },
  matchMessageText: {
    color: colors.text,
  },
  messageMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sentimentIcon: {
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
  suggestionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  suggestionButton: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    color: colors.text,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },
});

export default ChatScreen;
