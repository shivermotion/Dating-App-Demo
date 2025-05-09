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

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation =
    useNavigation<RootStackScreenProps<"SignUp">["navigation"]>();

  const handleSignUp = () => {
    // TODO: Implement sign up logic
    console.log("Sign up attempted with:", {
      name,
      email,
      password,
      confirmPassword,
    });
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <VStack space="xl" style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <VStack space="md" style={styles.form}>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </Input>

            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>

            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                type="password"
              />
            </Input>

            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                type="password"
              />
            </Input>

            <Button
              size="md"
              variant="solid"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}
              onPress={handleSignUp}
              style={styles.button}
            >
              <ButtonText style={styles.buttonText}>Sign Up</ButtonText>
            </Button>

            <HStack style={styles.footer}>
              <Button
                variant="link"
                onPress={handleLogin}
                style={styles.linkButton}
              >
                <ButtonText style={styles.linkButtonText}>
                  Already have an account? Login
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
