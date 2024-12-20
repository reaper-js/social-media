import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { icons, images } from "@/constants";
import EmptyState from "@/components/EmptyState";
import { useGlobal } from "@/context/GlobalProvider";

const UserProfile = () => {
  const {
    value: { user: currentUser },
  } = useGlobal();
  const { userId } = useLocalSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!currentUser) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading user data...</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const response = await fetch(`${url}/users/getProfile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);

        const isCurrentUserFollowing = data?.followers?.includes(
          currentUser?._id
        );
        setIsFollowing(isCurrentUserFollowing);

        const postsResponse = await fetch(`${url}/media/getPosts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const postsData = await postsResponse.json();
        setUserPosts(postsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>User not found</Text>
      </View>
    );
  }

  const handleFollowPress = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const endpoint = isFollowing ? "unfollow" : "follow";

      const response = await fetch(`${url}/users/${endpoint}/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);

        setUserData((prev: { followers: any[] }) => ({
          ...prev,
          followers: isFollowing
            ? prev.followers.filter((id: string) => id !== currentUser._id)
            : [...prev.followers, currentUser._id],
        }));
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  return (
    <>
      <SafeAreaView className="bg-red-400 flex-1">
        <ScrollView className="flex-1">
          <View className="items-center mt-6 px-4">
            <Image
              source={{
                uri: userData.avatar
                  ? `${url}/${userData.avatar}`
                  : images.watermelon,
              }}
              className="w-24 h-24 rounded-full"
            />
            <Text className="font-pbold text-2xl mt-2">{userData.name}</Text>
            <Text className="font-pregular text-lg">{userData.bio}</Text>

            <View className="flex-row justify-around w-full mt-4">
              <View className="items-center">
                <Text className="font-pbold text-lg">
                  {userData.followers?.length || 0}
                </Text>
                <Text className="font-pregular">Followers</Text>
              </View>
              <View className="items-center">
                <Text className="font-pbold text-lg">
                  {userData.following?.length || 0}
                </Text>
                <Text className="font-pregular">Following</Text>
              </View>
              <View className="items-center">
                <Text className="font-pbold text-lg">{userPosts.length}</Text>
                <Text className="font-pregular">Posts</Text>
              </View>
            </View>
            {currentUser && currentUser._id !== userId && (
              <TouchableOpacity
                className={`items-center justify-center mt-6 p-2 rounded-full ${
                  isFollowing ? "bg-gray-500" : "bg-green-800"
                } w-80 h-12`}
                onPress={handleFollowPress}
              >
                <Text className="text-white text-center font-pmedium">
                  {isFollowing ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="mt-6 px-4">
            {userPosts.length === 0 ? (
              <EmptyState
                title="User hasn't posted anything"
                subtitle=""
                isSearch={true}
              />
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {userPosts.map((post: any) => (
                  <View key={post._id} className="w-[32%] aspect-square mb-2">
                    <Image
                      source={{ uri: `${url}/${post.mediaUrl}` }}
                      className="w-full h-full rounded-lg"
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default UserProfile;
