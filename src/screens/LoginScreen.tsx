import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import {
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
  VStack,
  HStack,
  SafeAreaView,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../types/navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(var(--color-background))",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "rgb(var(--color-text))",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "rgb(var(--color-secondary))",
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 8,
    backgroundColor: "rgb(var(--color-primary))",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  linkButton: {
    padding: 0,
  },
  linkButtonText: {
    color: "rgb(var(--color-primary))",
    fontSize: 16,
  },
  footer: {
    justifyContent: "center",
    marginTop: 20,
  },
});

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation =
    useNavigation<RootStackScreenProps<"Login">["navigation"]>();

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log("Login attempted with:", { email, password });
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <VStack style={styles.content}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <VStack space="md" style={styles.form}>
            <Input>
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>

            <Input>
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                type="password"
              />
            </Input>

            <Button onPress={handleLogin} style={styles.button}>
              <ButtonText style={styles.buttonText}>Login</ButtonText>
            </Button>

            <HStack style={styles.footer}>
              <Button onPress={handleSignUp} style={styles.linkButton}>
                <ButtonText style={styles.linkButtonText}>
                  Don't have an account? Sign Up
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
