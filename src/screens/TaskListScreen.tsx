import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { RootStackParamList } from "../navigation/navigationTypes";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "TaskList">;

export function TaskListScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No tasks yet</Text>

        <Text style={styles.emptyDescription}>
          Add your first task to start organising your day.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("AddTask")}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>Add task</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  emptyDescription: {
    maxWidth: 280,
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  addButton: {
    marginTop: 24,
    minHeight: 48,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
