import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AddTaskScreen } from "../screens/AddTaskScreen";
import { TaskListScreen } from "../screens/TaskListScreen";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "./navigationTypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="TaskList"
        screenOptions={{
          headerBackTitle: "Tasks",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{
            title: "My Tasks",
          }}
        />

        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            title: "Add Task",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
