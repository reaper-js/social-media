import { TouchableOpacity, Text } from "react-native";
import React from "react";
import { isLoading } from "expo-font";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: any) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`rounded-3xl min-h-[62px] justify-center items-center px-4 py-2 ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      style={{ backgroundColor: "#2F6731" }}
      disabled={isLoading}
    >
      <Text className="text-white font-pblack">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
