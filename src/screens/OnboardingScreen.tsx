import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { observer } from "mobx-react-lite";
import {
  onboardingStore,
  ONBOARDING_QUESTIONS,
} from "../store/onboardingStore";
import { colors } from "../theme/colors";

const OnboardingScreen = observer(({ navigation }: any) => {
  const [answer, setAnswer] = useState("");

  const handleNext = async () => {
    if (!answer.trim()) return;

    onboardingStore.setAnswer(
      onboardingStore.currentQuestion.id,
      answer.trim()
    );
    setAnswer("");

    if (onboardingStore.isLastStep) {
      try {
        await onboardingStore.generateProfile();
        navigation.replace("MainTabs");
      } catch (error) {
        // Error is handled by the store
      }
    } else {
      onboardingStore.nextStep();
    }
  };

  const handleBack = () => {
    if (onboardingStore.currentStep > 0) {
      onboardingStore.previousStep();
      setAnswer(
        onboardingStore.answers[onboardingStore.currentQuestion.id] || ""
      );
    }
  };

  if (onboardingStore.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Generating your profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${onboardingStore.progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {onboardingStore.currentStep + 1} of{" "}
            {ONBOARDING_QUESTIONS.length}
          </Text>
        </View>

        <Text style={styles.title}>Let's get to know you</Text>
        <Text style={styles.subtitle}>
          {onboardingStore.currentQuestion.question}
        </Text>

        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
          placeholder={onboardingStore.currentQuestion.placeholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {onboardingStore.error && (
          <Text style={styles.error}>{onboardingStore.error}</Text>
        )}

        <View style={styles.buttonContainer}>
          {onboardingStore.currentStep > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBack}
            >
              <Text style={[styles.buttonText, styles.backButtonText]}>
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, !answer.trim() && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!answer.trim()}
          >
            <Text style={styles.buttonText}>
              {onboardingStore.isLastStep ? "Generate Profile" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.gray[300],
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    color: colors.text,
  },
});

export default OnboardingScreen;
