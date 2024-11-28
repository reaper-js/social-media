import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-6xl text-white">
        Brother this is fucking app development
      </Text>
      <StatusBar style="auto" />
      <Link href="./profile" style={{ color: "green" }}>
        Click on Profile
      </Link>
    </View>
  );
}
