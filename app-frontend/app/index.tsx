import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, Image } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "@/components/CustomButton";

export default function Index() {
  return (
    <SafeAreaView className="bg-red-500 h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[85vh] justify-center items-center px-4 mt-24">
          <Image
            source={images.watermelon}
            className="w-[180px] h-[180px] object-cover "
            resizeMode="contain"
          />
          <Text className="text-6xl text-white font-pblack">Melon</Text>
          <View className="relative mt-5 bg-black/10 rounded-full h-10 px-4 pt-2 mb-4">
            <Text className="text-white font-serif text-2xl">
              Discover the world with{" "}
              <Text className="text-green-500">Melon!!</Text>
            </Text>
          </View>
          <CustomButton
            title="Continue with E-mail"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-80 mt-40"
          />
        </View>
      </ScrollView>
    </SafeAreaView>

    // <View className="flex-1 items-center justify-center bg-red-500">
    //   <Text className="text-6xl text-white font-pblack">Melon</Text>
    //   <StatusBar style="auto" />
    //   <Link href="./home" style={{ color: "green" }}>
    //     Go to Home
    //   </Link>
    // </View>
  );
}
