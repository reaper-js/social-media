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

const url = process.env.EXPO_PUBLIC_API_URL;
const Profile = () => {
  const { user } = useGlobal();

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

  useEffect(() => {
    getPosts();
    fetchProfileData();
  }, []);

  const ProfileHeader = () => (
    <View className="mt-6 px-4">
      <View className="justify-between items-start flex-row mr-4">
        <Text className="text-5xl font-pblack pt-1 mt-3 ml-4">
          {profileData?.username}
        </Text>
        <Image
          source={images.watermelon}
          className="w-14 h-14"
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
          className="w-20 h-20 rounded-full"
        />
        <View className="flex-1 flex-row justify-around ml-4">
          <View className="items-center">
            <Text className="font-pbold text-xl">
              {profileData?.uploads?.length || 0}
            </Text>
            <Text className="font-pmedium">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="font-pbold text-xl">
              {profileData?.followers?.length || 0}
            </Text>
            <Text className="font-pmedium">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="font-pbold text-xl">
              {profileData?.following?.length || 0}
            </Text>
            <Text className="font-pmedium">Following</Text>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <View className="mt-4 ml-2">
        <Text className="font-pmedium">{profileData?.name}</Text>
        <Text className="text-gray-300 mt-1">{profileData?.bio}</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        className={`mt-4 p-2 rounded-full bg-green-800`}
        onPress={() => router.push("/profile")}
      >
        <Text className="text-white text-center font-pmedium">
          Edit Profile
        </Text>
      </TouchableOpacity>

      <Text className="font-pbold text-lg mt-6 mb-4">Posts</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-red-400">
      <FlatList
        data={posts}
        numColumns={3}
        className="flex-1"
        ListHeaderComponent={<ProfileHeader />}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-1 aspect-square m-0.5">
            <Image
              source={{
                uri: `${url}/${item.mediaUrl}`,
              }}
              className="w-full h-full"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-gray-600 font-pmedium">No posts yet</Text>
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
