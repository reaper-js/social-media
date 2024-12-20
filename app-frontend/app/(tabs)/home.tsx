import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
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
import PostVideo from "@/components/PostVideo";
import { useRouter } from "expo-router";
import { useGlobal } from "../../context/GlobalProvider";

const Home = () => {
  const router = useRouter();
  const url = process.env.EXPO_PUBLIC_API_URL;
  interface Post {
    _id: string;
    description: string;
    mediaUrl: string;
    mediaType: string;
    likes: string[];
    comments: any[];
    uploadedBy: {
      _id: string;
      name: string;
      avatar?: string;
    };
  }

  const {
    value: { user },
  } = useGlobal();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadInitialData = async () => {
        if (posts.length === 0 && user._id) {
          setPage(1);
          setPosts([]);
          setHasMore(true);
          await fetchPosts();
        }
      };

      loadInitialData();
    }, [user])
  );

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        console.error("No user token found");
        return;
      }

      const response = await fetch(`${url}/media/feed?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prevPosts) => {
          const existingPostIds = new Set(prevPosts.map((post) => post._id));
          const newPosts = data.posts.filter(
            (post: any) => !existingPostIds.has(post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }

      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    setPosts([]);
    setPage(1);
    setHasMore(true);
    await fetchPosts();

    setRefreshing(false);
  };

  const handleLike = async (postId: any) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${url}/media/toggleLike/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // updating posts state immediately to reflect the like status
        setPosts((prevPosts: Post[]) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const isLiked = post.likes.includes(user._id);
              return {
                ...post,
                likes: isLiked
                  ? post.likes.filter((id) => id !== user._id)
                  : [...post.likes, user._id].filter(
                      (id): id is string => id !== null
                    ),
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string) => {
    router.push(`/comments/${postId}`);
  };

  // const items: Array<{ id: number }> = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const renderPost = ({ item }: { item: any }) => (
    <View className="p-4 bg-red-500 m-2 rounded-xl">
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
      {item.mediaType === "video" ? (
        <PostVideo videoUrl={`${url}/${item.mediaUrl}`} />
      ) : (
        <Image
          source={{ uri: `${url}/${item.mediaUrl}` }}
          className="w-full h-64 rounded-xl"
          resizeMode="cover"
        />
      )}
      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row gap-4 space-x-4">
          <TouchableOpacity
            onPress={() => handleLike(item._id)}
            className="flex-row items-center mt-1 gap-1"
          >
            <FontAwesome
              name={item.likes.includes(user._id) ? "heart" : "heart-o"}
              size={24}
              color={item.likes.includes(user._id) ? "#2e7d32" : "#000000"}
            />
            <Text className="font-psemibold ml-1">{item.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleComment(item._id)}
            className="flex-row items-center gap-1"
          >
            <FontAwesome name="comment-o" size={24} color="black" />
            <Text className="font-psemibold">{item.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text className="mt-2">{item.description}</Text>
    </View>
  );
  return (
    <SafeAreaView className="bg-red-400 flex-1 h-full" edges={["top"]}>
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
        ListFooterComponent={() =>
          loading && hasMore ? (
            <View className="py-4">
              <ActivityIndicator size="large" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.2}
      />
    </SafeAreaView>
  );
};

export default Home;
