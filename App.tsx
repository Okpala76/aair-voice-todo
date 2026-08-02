import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TaskProvider } from "./src/features/tasks/TaskContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </TaskProvider>
    </SafeAreaProvider>
  );
}
