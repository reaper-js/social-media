import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import React from "react";
import images from "../constants/images";
import CustomButton from "./CustomButton";

type EmptyStateProps = {
  title: string;
  subtitle: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.search}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="text-3xl font-psemibold text-center">{title}</Text>

      <CustomButton
        title="Create a Post"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-4"
      />
    </View>
  );
};

export default EmptyState;
