import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { RootNavigator } from "./src/navigation/RootNavigator";

const App = () => {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
};

export default App;
