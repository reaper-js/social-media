import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobal } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import CustomButton from "@/components/CustomButton";

const url = process.env.EXPO_PUBLIC_API_URL;

const EditProfile = () => {
  const { user } = useGlobal();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  let userId: any;
  const fetchProfileData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        throw new Error("No token found");
      }
      userId = JSON.parse(atob(token.split(".")[1]))._id;
      const response = await fetch(`${url}/users/getProfile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfileData(data);
      setAvatar(data.avatar);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("userToken");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("bio", bio);

      if (
        avatar &&
        (avatar.startsWith("file://") || avatar.startsWith("content://"))
      ) {
        const imageUri =
          Platform.OS === "ios" ? avatar.replace("file://", "") : avatar;
        formData.append("avatar", {
          uri: imageUri,
          type: "image/jpeg",
          name: "profile-image.jpg",
        } as any);
      }

      const response = await fetch(`${url}/users/update-profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        await fetchProfileData();
        router.back();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-red-400">
      <ScrollView className="flex-1 px-4">
        <View className="flex-row items-center justify-between mt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.leftArrow}
              className="w-6 h-6"
              tintColor={"green"}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="font-pbold text-green-800 text-2xl">
            Edit Profile
          </Text>
          <View className="w-6" />
        </View>

        <View className="items-center mt-8">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                avatar
                  ? avatar.startsWith("file://") ||
                    avatar.startsWith("content://")
                    ? { uri: avatar }
                    : { uri: `${url}/${avatar}` }
                  : images.profile
              }
              className="w-24 h-24 rounded-full"
            />

            <View className="absolute bottom-0 right-0 bg-green-800 p-2 rounded-full">
              <Image
                source={icons.upload}
                className="w-4 h-4 tint-white"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-8 space-y-4">
          <View>
            <Text className="text-white font-pmedium mb-2">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="bg-white p-4 rounded-2xl text-green-800 font-pregular"
              placeholder="Enter your name"
            />
          </View>

          <View>
            <Text className="text-white font-pmedium mb-2">Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              className="bg-white p-4 rounded-2xl text-green-800 font-pregular"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Write something about yourself"
            />
          </View>
        </View>

        <CustomButton
          title={isLoading ? "Updating..." : "Save Changes"}
          handlePress={handleUpdate}
          disabled={isLoading}
          containerStyles="mt-8 mb-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
