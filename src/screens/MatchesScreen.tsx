import React, { useEffect } from "react";
import {
  Box,
  Text,
  ScrollView,
  Image,
  HStack,
  VStack,
  Badge,
  Pressable,
} from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { store } from "../store";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { Platform } from "react-native";

// Placeholder images for different profile types
const PLACEHOLDER_IMAGES = {
  profile1:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
  profile2:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
  profile3:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60",
  profile4:
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60",
  profile5:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60",
};

const MatchesScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Set mock matches in store with high-quality placeholder images
    store.setMatches([
      {
        id: "1",
        name: "Sarah",
        age: 26,
        bio: "Love hiking and photography. Looking for someone to share adventures with.",
        photos: [PLACEHOLDER_IMAGES.profile1],
        compatibility: 0.95,
        interests: ["Hiking", "Photography", "Travel"],
        personalityTraits: ["Adventurous", "Creative", "Outgoing"],
      },
      {
        id: "2",
        name: "Emma",
        age: 28,
        bio: "Coffee enthusiast and book lover. Let's discuss our favorite novels over a cup of coffee.",
        photos: [PLACEHOLDER_IMAGES.profile2],
        compatibility: 0.88,
        interests: ["Reading", "Coffee", "Art"],
        personalityTraits: ["Intellectual", "Creative", "Introverted"],
      },
      {
        id: "3",
        name: "Olivia",
        age: 25,
        bio: "Fitness instructor and foodie. Looking for someone who shares my passion for healthy living.",
        photos: [PLACEHOLDER_IMAGES.profile3],
        compatibility: 0.82,
        interests: ["Fitness", "Cooking", "Yoga"],
        personalityTraits: ["Energetic", "Disciplined", "Friendly"],
      },
      {
        id: "4",
        name: "Sophia",
        age: 27,
        bio: "Digital artist and music lover. Looking for someone to share creative moments with.",
        photos: [PLACEHOLDER_IMAGES.profile4],
        compatibility: 0.78,
        interests: ["Art", "Music", "Design"],
        personalityTraits: ["Creative", "Passionate", "Introverted"],
      },
      {
        id: "5",
        name: "Isabella",
        age: 24,
        bio: "Adventure seeker and food explorer. Let's discover new places together!",
        photos: [PLACEHOLDER_IMAGES.profile5],
        compatibility: 0.75,
        interests: ["Travel", "Food", "Adventure"],
        personalityTraits: ["Adventurous", "Friendly", "Outgoing"],
      },
    ]);
  }, []);

  const handleConnect = (matchId: string) => {
    const match = store.matches.find((m) => m.id === matchId);
    if (match) {
      navigation.navigate("Chat", { matchId, matchName: match.name });
    }
  };

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
              onPress={() => handleConnect(match.id)}
              className="mb-6"
            >
              <Box className="bg-white rounded-xl overflow-hidden">
                <Box className="relative">
                  <Image
                    source={{ uri: match.photos[0] }}
                    className="w-full h-80"
                    alt={match.name}
                    resizeMode="cover"
                  />
                  <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <HStack className="justify-between items-end">
                      <VStack className="flex-1 mr-4">
                        <Text className="text-white text-2xl font-bold">
                          {match.name}, {match.age}
                        </Text>
                        <Text
                          className="text-white/90 text-sm mt-1"
                          numberOfLines={2}
                        >
                          {match.bio}
                        </Text>
                      </VStack>
                      <Badge
                        variant="solid"
                        action="success"
                        className="bg-primary-500/90"
                      >
                        <Badge.Text className="text-white text-sm">
                          {Math.round(match.compatibility * 100)}% Match
                        </Badge.Text>
                      </Badge>
                    </HStack>
                  </Box>
                </Box>
                <Box className="p-4">
                  <HStack className="flex-wrap gap-2">
                    {match.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="border-primary-200"
                      >
                        <Badge.Text className="text-primary-600 text-sm">
                          {interest}
                        </Badge.Text>
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              </Box>
            </Pressable>
          ))}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

MatchesScreen.displayName = "MatchesScreen";

export const MatchesScreenObserver = observer(MatchesScreen);
