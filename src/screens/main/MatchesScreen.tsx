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
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    rootStore.match.loadMatches();
  }, []);

  const filteredMatches = rootStore.match.matches.filter((match) => {
    const matchesSearch = match.user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "new" && match.isNew) ||
      (selectedFilter === "online" && match.user.isOnline);
    return matchesSearch && matchesFilter;
  });

  const renderMatch = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate("Chat", { matchId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.user.profileImage || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
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
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: string, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
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
        <Text style={styles.title}>Your Matches</Text>
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
        <View style={styles.filterContainer}>
          {renderFilterButton("all", "All")}
          {renderFilterButton("new", "New")}
          {renderFilterButton("online", "Online")}
        </View>
      </View>
      <FlatList
        data={filteredMatches}
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
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.text,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: colors.white,
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
  newBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
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
});

export default MatchesScreen;
