import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { icons } from "@/constants";

type FormFieldProps = {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
};

const SearchInput: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full h-16 bg-white rounded-3xl justify-center items-center flex-row space-x-4">
      <TextInput
        className="flex-1 text-green-700 font-psemibold text-base px-6"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="black"
        onChangeText={handleChangeText}
        secureTextEntry={title === "Password" && !showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        returnKeyType="search"
      />
      <TouchableOpacity>
        <Image
          source={icons.search}
          className="w-5 h-5 mr-4 text-green-700"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
export default SearchInput;
