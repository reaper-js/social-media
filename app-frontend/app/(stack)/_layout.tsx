import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#F87171",
        },
      }}
    >
      <Stack.Screen
        name="comments/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default StackLayout;
