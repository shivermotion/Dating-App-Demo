import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native";
import { observer } from "mobx-react-lite";
import { rootStore } from "../../store";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const MatchesScreen = observer(({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    rootStore.match.loadTodayMatches();
  }, []);

  const handlePass = async (matchId: string) => {
    await rootStore.match.passMatch(matchId);
  };

  const handleLike = async (matchId: string) => {
    await rootStore.match.likeMatch(matchId);
  };

  const handleChat = (matchId: string) => {
    navigation.navigate("Chat", { matchId });
  };

  const renderMatch = ({ item }: { item: any }) => (
    <View style={styles.matchCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.user.profileImage || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.matchInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.user.name}</Text>
          <Text style={styles.age}>{item.user.age}</Text>
        </View>
        <Text style={styles.bio} numberOfLines={2}>
          {item.user.bio || "No bio yet"}
        </Text>
        <View style={styles.traitsContainer}>
          {item.user.traits.slice(0, 3).map((trait: string, index: number) => (
            <View key={index} style={styles.traitBadge}>
              <Text style={styles.traitText}>{trait}</Text>
            </View>
          ))}
        </View>
        <View style={styles.matchScoreContainer}>
          <Ionicons name="heart" size={16} color={colors.primary} />
          <Text style={styles.compatibility}>
            {Math.round(item.score * 100)}% Match
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handlePass(item.id)}
        >
          <Ionicons name="close" size={24} color={colors.error} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons name="heart" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.chatButton]}
          onPress={() => handleChat(item.id)}
        >
          <Ionicons name="chatbubble" size={24} color={colors.success} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Picks</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search matches..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray[400]}
          />
        </View>
      </View>
      <FlatList
        data={rootStore.match.matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.text,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  matchCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: width - 32,
    height: 200,
    resizeMode: "cover",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  matchInfo: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginRight: 8,
  },
  age: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  bio: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  traitBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  traitText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  matchScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compatibility: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[100],
  },
  passButton: {
    backgroundColor: colors.gray[100],
  },
  likeButton: {
    backgroundColor: colors.gray[100],
  },
  chatButton: {
    backgroundColor: colors.gray[100],
  },
});

export default MatchesScreen;
