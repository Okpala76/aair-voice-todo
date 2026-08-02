import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Task } from "../features/tasks/taskTypes";
import { colors } from "../theme/colors";

type TaskCardProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (task: Task) => void;
};

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>
      <Pressable
        accessibilityLabel={
          task.completed
            ? `Mark ${task.title} as incomplete`
            : `Mark ${task.title} as complete`
        }
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: task.completed,
        }}
        hitSlop={8}
        onPress={() => onToggle(task.id)}
        style={({ pressed }) => [
          styles.checkbox,
          task.completed && styles.checkboxCompleted,
          pressed && styles.controlPressed,
        ]}
      >
        {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      <View style={styles.content}>
        <Text
          numberOfLines={3}
          style={[styles.title, task.completed && styles.completedText]}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text
            numberOfLines={4}
            style={[
              styles.description,
              task.completed && styles.completedDescription,
            ]}
          >
            {task.description}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityLabel={`Delete ${task.title}`}
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onDelete(task)}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.controlPressed,
        ]}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 16,
  },
  completedCard: {
    opacity: 0.72,
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 23,
  },
  completedText: {
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },
  description: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  completedDescription: {
    textDecorationLine: "line-through",
  },
  deleteButton: {
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  controlPressed: {
    opacity: 0.55,
  },
});
