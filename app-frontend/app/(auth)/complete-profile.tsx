import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { images } from "@/constants";
import * as SecureStore from "expo-secure-store";

const CompleteProfile = () => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const params = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };
  const registerUser = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", params.name as string);
      formData.append("email", params.email as string);
      formData.append("password", params.password as string);
      formData.append("username", username);

      if (profileImage) {
        formData.append("avatar", {
          uri: profileImage,
          type: "image/jpeg",
          name: "profile-image.jpg",
        } as any);
      }

      console.log(formData);
      const response = await fetch(`${url}/users/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        await SecureStore.setItemAsync("userToken", data.token);
        router.replace("/home");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await fetch(`${url}/users/checkUsername/${value}`);
      const data = await response.json();
      setIsUsernameAvailable(data.available);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const timeoutId = setTimeout(() => {
      checkUsername(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <SafeAreaView className="h-full bg-red-500">
      <ScrollView>
        <View className="w-full justify-center items-center my-6">
          <Text className="text-3xl text-white font-pblack mb-8">
            Complete Your Profile
          </Text>

          <TouchableOpacity onPress={pickImage}>
            <Image
              source={profileImage ? { uri: profileImage } : images.profile}
              className="w-32 h-32 rounded-full mb-6"
            />
            <Text className="text-secondary text-center">
              Add Profile Picture
            </Text>
          </TouchableOpacity>

          <FormField
            title="Username"
            value={username}
            otherStyles="mt-7 mx-4 px-4"
            handleChangeText={handleUsernameChange}
          />

          {isCheckingUsername && (
            <Text className="text-gray-100 mt-2">Checking username...</Text>
          )}

          {isUsernameAvailable !== null && !isCheckingUsername && (
            <Text
              className={`mt-2 ${
                isUsernameAvailable ? "text-green-500" : "text-red-500"
              }`}
            >
              {isUsernameAvailable
                ? "Username is available!"
                : "Username is already taken"}
            </Text>
          )}

          <CustomButton
            title="Complete Profile"
            handlePress={registerUser}
            containerStyles="mt-7 mx-8 px-4 w-96"
            isLoading={isSubmitting}
            disabled={!isUsernameAvailable || isCheckingUsername}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompleteProfile;
