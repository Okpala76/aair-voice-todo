import { useTasks } from "../features/tasks/TaskContext";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "../navigation/navigationTypes";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

export function AddTaskScreen({ navigation }: Props) {
  const { addTask, state } = useTasks();

  function addTestTask() {
    const task = addTask({
      title: `Test task ${state.tasks.length + 1}`,
      description: "Created during persistence testing",
    });

    Alert.alert("Task added", task.title);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task Screen</Text>

      <Text style={styles.description}>
        The task form will be implemented in the manual task flow batch.
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={addTestTask}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Add test task</Text>
        </Pressable>
        <Text style={styles.buttonText}>Return to tasks</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  description: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginTop: 24,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
