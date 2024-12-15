import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
// import Search from "../search/[query]";
import EmptyState from "@/components/EmptyState";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Home = () => {
  const url = process.env.EXPO_PUBLIC_API_URL;

  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  const getUserId = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
    }
  };
  const fetchPosts = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${url}/media/feed`, {
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
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: any) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(
        `http://your-backend-url/api/media/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchPosts(); // Refresh posts to show updated likes
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSavePost = async ({ postId }: { postId: any }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(
        `http://your-backend-url/api/media/${postId}/save`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleCommentPress = ({ postId }: { postId: any }) => {
    // Navigate to comments screen or open comments modal
    // navigation.navigate("Comments", { postId });
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      getUserId();
    }, [])
  );

  // const items: Array<{ id: number }> = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const renderPost = ({ item }: { item: any }) => (
    <View className="p-4 bg-red-500 m-4 rounded-xl">
      <View className="flex-row items-center mb-2">
        <Image
          source={
            item.uploadedBy.avatar
              ? { uri: `${url}/${item.uploadedBy.avatar}` }
              : images.profile
          }
          className="w-10 h-10 rounded-full"
        />
        <Text className="ml-2 font-psemibold">{item.uploadedBy.name}</Text>
      </View>
      <Image
        source={{ uri: `${url}/${item.mediaUrl}` }}
        className="w-full h-64 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row gap-4 space-x-4">
          <TouchableOpacity
            onPress={() => handleLike(item._id)}
            className="flex-row items-center mt-1 gap-1"
          >
            <FontAwesome
              name={item.likes.includes(userId) ? "heart" : "heart-o"}
              size={24}
              color={item.likes.includes(userId) ? "#FF0000" : "#000000"}
            />
            <Text className="font-psemibold ml-1">{item.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCommentPress(item._id)}
            className="flex-row items-center gap-1"
          >
            <FontAwesome name="comment-o" size={24} color="black" />
            <Text className="font-psemibold">{item.comments.length}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleSavePost(item._id)}>
          <Text className="font-psemibold">{item.isSaved ? "📥" : "📤"}</Text>
        </TouchableOpacity>
      </View>
      <Text className="mt-2">{item.description}</Text>

      {/* Comments section */}
      {item.comments.length > 0 && (
        <View className="mt-2">
          {item.comments
            .slice(0, 2)
            .map(({ comment, index }: { comment: any; index: any }) => (
              <View key={index} className="flex-row items-center mt-1">
                <Text className="font-psemibold">{comment.user.name}</Text>
                <Text className="ml-2">{comment.text}</Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
  return (
    <SafeAreaView className="bg-red-400 flex-1 h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        ListHeaderComponent={() => (
          <View className="mt-6 px-4 ">
            <View className="justify-between items-start flex-row mr-4">
              <View>
                <Text className="text-5xl font-pblack pt-1 mt-3 ml-4">
                  Feed
                </Text>
              </View>
              <View>
                <Image
                  source={images.watermelon}
                  className="w-14 h-14"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subtitle="Try searching for something else"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
