import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { routeToScreen } from "expo-router/build/useScreens";
import { router } from "expo-router";

const Create = () => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!mediaUri) {
      alert("Please select a media to post");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();

    const filename = mediaUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");

    // Determine media type based on file extension
    const fileExtension = match ? match[1].toLowerCase() : "";
    const isVideo = [
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      "3gp",
      "flv",
      "h264",
    ].includes(fileExtension);
    const mediaType = isVideo ? "video" : "image";
    const type = isVideo ? `video/${fileExtension}` : `image/${fileExtension}`;

    formData.append("media", {
      uri: mediaUri,
      type,
      name: filename || "media",
    } as any);
    formData.append("description", caption);
    formData.append("mediaType", mediaType); // Now sending correct mediaType
    const token = await SecureStore.getItemAsync("userToken");
    try {
      const response = await fetch(`${url}/media/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMediaUri(null);
      setCaption("");
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      router.push("/home");
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="bg-red-400 flex-1 h-full">
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6 mr-4">
          <View>
            <Text className="text-5xl font-pblack pt-1 mt-3 ml-4">Post</Text>
          </View>
          <View>
            <Image
              source={images.watermelon}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
        </View>
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity
            onPress={pickMedia}
            className="w-full h-80 bg-white rounded-xl justify-center items-center mb-6"
          >
            {mediaUri ? (
              <Image
                source={{ uri: mediaUri }}
                className="w-full h-full rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <Image
                  source={images.thumbnail}
                  className="w-20 h-20 mb-2"
                  resizeMode="contain"
                />
                <Text className="text-green-700 font-pmedium">
                  Tap to upload image or video
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="Caption"
          value={caption}
          placeholder="Write a caption..."
          handleChangeText={setCaption}
          otherStyles="mb-6"
        />

        <CustomButton
          title="Share Post"
          handlePress={handlePost}
          isLoading={isLoading}
          containerStyles="w-full"
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
