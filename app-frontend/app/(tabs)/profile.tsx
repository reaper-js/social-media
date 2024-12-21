import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobal } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import PostVideo from "@/components/PostVideo";
import ProfileVideo from "@/components/ProfileVideo";

const url = process.env.EXPO_PUBLIC_API_URL;
const Profile = () => {
  const {
    value: { user },
  } = useGlobal();

  const [posts, setPosts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
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
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const getPosts = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        throw new Error("No token found");
      }
      userId = JSON.parse(atob(token.split(".")[1]))._id;
      const response = await fetch(`${url}/media/getPosts/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getPosts();
    await fetchProfileData();
    setRefreshing(false);
  };

  const handlePress = async (postId: string) => {
    router.push(`/comments/${postId}`);
  };

  useEffect(() => {
    getPosts();
    fetchProfileData();
  }, []);

  const ProfileHeader = () => (
    <View className="mt-6 px-4">
      <View className="justify-between items-start flex-row mr-4">
        <Text className="text-3xl text-[#57C5B6] font-pblack pt-1 mt-4 ml-4">
          {profileData?.username}
        </Text>
        <Image
          source={images.melonSearch}
          className="w-20 h-20 -mt-4 -mr-3"
          resizeMode="contain"
        />
      </View>

      {/* Profile Info Section */}
      <View className="flex-row items-center mt-6">
        <Image
          source={
            profileData?.avatar
              ? { uri: `${url}/${profileData.avatar}` }
              : images.watermelon
          }
          className="w-20 h-20 rounded-full border-2 border-[#57C5B6]"
        />
        <View className="flex-1 flex-row justify-around ml-4">
          <View className="items-center">
            <Text className="font-pbold text-[#57C5B6] text-xl">
              {profileData?.uploads?.length || 0}
            </Text>
            <Text className="font-pmedium text-[#57C5B6]">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="font-pbold text-xl text-[#57C5B6]">
              {profileData?.followers?.length || 0}
            </Text>
            <Text className="font-pmedium text-[#57C5B6]">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="font-pbold text-xl text-[#57C5B6]">
              {profileData?.following?.length || 0}
            </Text>
            <Text className="font-pmedium text-[#57C5B6]">Following</Text>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <View className="mt-4 ml-2">
        <Text className="font-pmedium text-[#57C5B6]">{profileData?.name}</Text>
        <Text className="text-gray-300 mt-1 text-[#57C5B6]">
          {profileData?.bio}
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        className={`mt-4 p-2 rounded-full bg-[#57C5B6]`}
        onPress={() => router.push("/edit-profile")}
      >
        <Text className="text-white text-center font-pmedium">
          Edit Profile
        </Text>
      </TouchableOpacity>
      <Text className="font-pbold text-lg text-[#57C5B6] mt-6 mb-4">Posts</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#002B5B]">
      <FlatList
        data={posts}
        numColumns={3}
        className="flex-1"
        ListHeaderComponent={<ProfileHeader />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="w-[33%] aspect-square m-0.5"
            onPress={() => handlePress(item._id)}
          >
            {item.mediaType === "video" ? (
              <ProfileVideo videoUrl={`${url}/${item.mediaUrl}`} />
            ) : (
              <Image
                source={{
                  uri: `${url}/${item.mediaUrl}`,
                }}
                resizeMode="cover"
                className="w-full h-full"
              />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-gray-600 font-pmedium text-[#57C5B6]">
              No posts yet
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
