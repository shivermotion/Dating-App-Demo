import React from "react";
import {
  Box,
  Text,
  ScrollView,
  Image,
  HStack,
  VStack,
  Badge,
  Button,
  Pressable,
} from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { store } from "../store";
import { Platform } from "react-native";

// Placeholder images for profile
const PROFILE_IMAGES = {
  main: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
  gallery: [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60",
  ],
};

const ProfileScreen = () => {
  const dummyUser = {
    id: "1",
    name: "Alex",
    age: 28,
    bio: "Adventure seeker and coffee enthusiast. Love exploring new places and meeting interesting people. Looking for someone to share life's adventures with.",
    photos: [PROFILE_IMAGES.main, ...PROFILE_IMAGES.gallery],
    interests: ["Travel", "Photography", "Coffee", "Hiking", "Music"],
    personalityTraits: ["Adventurous", "Creative", "Outgoing"],
    location: {
      city: "San Francisco",
      country: "United States",
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 100 : 80,
        }}
      >
        <Box className="relative">
          <Image
            source={{ uri: dummyUser.photos[0] }}
            className="w-full h-96"
            alt={dummyUser.name}
            resizeMode="cover"
          />
          <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <Text className="text-white text-3xl font-bold">
              {dummyUser.name}, {dummyUser.age}
            </Text>
            <Text className="text-white/90 text-base mt-1">
              {dummyUser.location.city}, {dummyUser.location.country}
            </Text>
          </Box>
        </Box>

        <Box className="p-4">
          <VStack space="md">
            <Box>
              <Text className="text-lg font-semibold mb-2">About Me</Text>
              <Text className="text-gray-700">{dummyUser.bio}</Text>
            </Box>

            <Box>
              <Text className="text-lg font-semibold mb-2">Interests</Text>
              <HStack className="flex-wrap gap-2">
                {dummyUser.interests.map((interest) => (
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

            <Box>
              <Text className="text-lg font-semibold mb-2">Personality</Text>
              <HStack className="flex-wrap gap-2">
                {dummyUser.personalityTraits.map((trait) => (
                  <Badge
                    key={trait}
                    variant="solid"
                    action="primary"
                    className="bg-primary-500/90"
                  >
                    <Badge.Text className="text-white text-sm">
                      {trait}
                    </Badge.Text>
                  </Badge>
                ))}
              </HStack>
            </Box>

            <Box>
              <Text className="text-lg font-semibold mb-2">Photo Gallery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="sm">
                  {dummyUser.photos.slice(1).map((photo, index) => (
                    <Pressable key={index} className="mr-2">
                      <Image
                        source={{ uri: photo }}
                        className="w-32 h-32 rounded-lg"
                        alt={`Gallery ${index + 1}`}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </HStack>
              </ScrollView>
            </Box>

            <Button
              variant="solid"
              action="primary"
              className="bg-primary-500 mt-4"
            >
              <Button.Text className="text-white">Edit Profile</Button.Text>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

ProfileScreen.displayName = "ProfileScreen";

export const ProfileScreenObserver = observer(ProfileScreen);
