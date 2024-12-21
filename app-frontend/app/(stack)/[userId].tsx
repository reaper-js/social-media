import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { icons, images } from "@/constants";
import EmptyState from "@/components/EmptyState";
import { useGlobal } from "@/context/GlobalProvider";
import ProfileVideo from "@/components/ProfileVideo";

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
  const handlePress = async (postId: string) => {
    router.push(`/comments/${postId}`);
  };

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

  const ProfileHeader = () => (
    <View className="mt-6 px-4">
      <View>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.leftArrow}
            className="w-6 h-6 ml-6 mt-6"
            tintColor={"#57C5B6"}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View className="items-center mt-6 px-4">
        <Image
          source={{
            uri: userData.avatar
              ? `${url}/${userData.avatar}`
              : images.watermelon,
          }}
          className="w-24 h-24 rounded-full"
        />
        <Text className="font-pbold text-2xl mt-2 text-[#57C5B6]">
          {userData.name}
        </Text>
        <Text className="font-pregular text-lg">{userData.bio}</Text>

        <View className="flex-row justify-around w-full mt-4">
          <View className="items-center">
            <Text className="font-pbold text-lg text-[#57C5B6]">
              {userData.followers?.length || 0}
            </Text>
            <Text className="font-pregular text-[#57C5B6]">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="font-pbold text-lg text-[#57C5B6]">
              {userData.following?.length || 0}
            </Text>
            <Text className="font-pregular text-[#57C5B6]">Following</Text>
          </View>
          <View className="items-center">
            <Text className="font-pbold text-lg text-[#57C5B6]">
              {userPosts.length}
            </Text>
            <Text className="font-pregular text-[#57C5B6]">Posts</Text>
          </View>
        </View>
        {currentUser && currentUser._id !== userId && (
          <TouchableOpacity
            className={`items-center justify-center mt-6 p-2 rounded-full ${
              isFollowing ? "bg-[#1A5F7A]" : "bg-[#57C5B6]"
            } w-80 h-12`}
            onPress={handleFollowPress}
          >
            <Text className="text-white text-center font-pmedium">
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
        <Text className="font-pbold text-lg text-[#57C5B6] mt-6 mb-2"></Text>
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView className="bg-[#002B5B] flex-1">
        <FlatList
          data={userPosts}
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
        />
      </SafeAreaView>
    </>
  );
};
export default UserProfile;
