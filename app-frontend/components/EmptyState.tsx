import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import React from "react";
import images from "../constants/images";
import CustomButton from "./CustomButton";

type EmptyStateProps = {
  title: string;
  subtitle: string;
  isSearch?: boolean;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  isSearch,
}) => {
  return (
    <View className="justify-center items-center px-4 mt-24">
      <Image
        source={images.watermelon}
        className="w-[150px] h-[215px] mr-10"
        resizeMode="contain"
      />
      <Text className="text-3xl text-[#57C5B6] font-psemibold text-center -mt-4 mb-1">
        {title}
      </Text>

      {!isSearch && (
        <CustomButton
          title="Create a Post"
          handlePress={() => router.push("/create")}
          containerStyles="w-80 my-4 bg-[#159895]"
        />
      )}
    </View>
  );
};

export default EmptyState;
