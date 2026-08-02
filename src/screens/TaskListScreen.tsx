import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TaskCard } from "../components/TaskCard";
import { useTasks } from "../features/tasks/TaskContext";
import type { Task } from "../features/tasks/taskTypes";
import type { RootStackParamList } from "../navigation/navigationTypes";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "TaskList">;

export function TaskListScreen({ navigation }: Props) {
  const { state, storageError, toggleTask, deleteTask } = useTasks();

  const insets = useSafeAreaInsets();

  const activeTaskCount = useMemo(
    () => state.tasks.filter((task) => !task.completed).length,
    [state.tasks],
  );

  const completedTaskCount = state.tasks.length - activeTaskCount;

  function confirmDelete(task: Task) {
    Alert.alert(
      "Delete task?",
      `"${task.title}" will be permanently removed.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTask(task.id),
        },
      ],
    );
  }

  if (!state.isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />

        <Text style={styles.loadingText}>Loading your tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          state.tasks.length === 0 && styles.emptyListContent,
        ]}
        data={state.tasks}
        keyExtractor={(task) => task.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View style={styles.introduction}>
              <Text style={styles.heading}>Your tasks</Text>

              <Text style={styles.subheading}>
                Keep track of what needs your attention.
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>{activeTaskCount}</Text>

                <Text style={styles.summaryLabel}>Active</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>{completedTaskCount}</Text>

                <Text style={styles.summaryLabel}>Completed</Text>
              </View>
            </View>

            {storageError ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{storageError}</Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>✓</Text>
            </View>

            <Text style={styles.emptyTitle}>No tasks yet</Text>

            <Text style={styles.emptyDescription}>
              Add your first task and start organising your day.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("AddTask")}
              style={({ pressed }) => [
                styles.emptyButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.emptyButtonText}>Add your first task</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onDelete={confirmDelete}
            onToggle={toggleTask}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        accessibilityLabel="Add a new task"
        accessibilityRole="button"
        onPress={() => navigation.navigate("AddTask")}
        style={({ pressed }) => [
          styles.addButton,
          {
            bottom: insets.bottom + 20,
          },
          pressed && styles.addButtonPressed,
        ]}
      >
        <Text style={styles.addButtonIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    color: colors.textSecondary,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  introduction: {
    marginBottom: 20,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "700",
  },
  subheading: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    padding: 16,
  },
  summaryNumber: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "700",
  },
  summaryLabel: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
  },
  errorBanner: {
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    padding: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    backgroundColor: "#EDE9FE",
  },
  emptyIconText: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "800",
  },
  emptyTitle: {
    marginTop: 20,
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  emptyDescription: {
    maxWidth: 280,
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  emptyButton: {
    minHeight: 48,
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  separator: {
    height: 12,
  },
  addButton: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.96 }],
  },
  addButtonIcon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "400",
    lineHeight: 38,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
