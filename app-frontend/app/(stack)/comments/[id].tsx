import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import images from "../../../constants/images";
import PostVideo from "@/components/PostVideo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import FormField from "@/components/FormField";
import { useGlobal } from "@/context/GlobalProvider";

export default function Comments() {
  const { user } = useGlobal();
  const { id } = useLocalSearchParams();
  const url = process.env.EXPO_PUBLIC_API_URL;
  const [post, setPost] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const fetchPost = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    const response = await fetch(`${url}/media/getPost/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPost(data);
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const token = await SecureStore.getItemAsync("userToken");
    await fetch(`${url}/media/postComment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });

    setCommentText("");
    fetchPost();
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
      const updatedPost = await response.json();
      setPost({
        ...post,
        likes: updatedPost.likes,
      });
      setIsLiked(
        updatedPost.likes.some((like: { _id: any }) => like._id === user._id)
      );
    } catch (error) {
      console.log("Error liking post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  // Second useEffect for checking like status
  useEffect(() => {
    if (post && user) {
      const isPostLikedByUser = post.likes.some(
        (like: { _id: any }) => like._id === user._id
      );
      setIsLiked(isPostLikedByUser);
    }
  }, [post?.likes, user?._id]);
  if (!post) return null;

  return (
    <SafeAreaView className="bg-[#002B5B] flex-1 h-full">
      <ScrollView>
        <View className="mt-4 px-4">
          <View className="justify-between items-start flex-row mr-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={icons.leftArrow}
                className="w-6 h-6 mt-3.5"
                tintColor={"#57C5B6"}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text className="text-3xl font-pblack pt-1 mt-3 ml-10"></Text>
            <Image
              source={images.melonSearch}
              className="w-20 h-20 -mt-4 -mr-3"
              resizeMode="contain"
            />
          </View>
        </View>
        <View className="p-2 border-2 border-[#57C5B6] m-2 rounded-2xl">
          <View className="flex-row items-center mb-2">
            <Image
              source={
                post.uploadedBy.avatar
                  ? { uri: `${url}/${post.uploadedBy.avatar}` }
                  : images.profile
              }
              className="w-10 h-10 rounded-full"
            />
            <Text className="ml-2 font-psemibold text-[#57C5B6]">
              {post.uploadedBy.name}
            </Text>
          </View>
          {post.mediaType === "video" ? (
            <PostVideo videoUrl={`${url}/${post.mediaUrl}`} />
          ) : (
            <Image
              source={{ uri: `${url}/${post.mediaUrl}` }}
              className="w-full h-64 rounded-xl"
              resizeMode="cover"
            />
          )}
          <TouchableOpacity
            onPress={() => handleLike(post._id)}
            className="flex-row items-center mt-3 ml-2 gap-1"
          >
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              size={24}
              color={isLiked ? "#57C5B6" : "#57C5B6"}
            />
            <Text className="font-psemibold ml-1 text-[#57C5B6]">
              {post.likes.length}
            </Text>
          </TouchableOpacity>
          <Text className="mt-2 ml-1 font-sans-serif font-bold text-[#57C5B6]">
            {post.description}
          </Text>
        </View>

        {post.comments.map((item: any, index: number) => (
          <View key={index} className="p-4 flex-row">
            <Image
              source={
                item.user.avatar
                  ? { uri: `${url}/${item.user.avatar}` }
                  : images.profile
              }
              className="w-8 h-8 rounded-full"
            />
            <View className="ml-2 flex-1">
              <Text className="font-psemibold text-[#57C5B6]">
                {item.user.name}
              </Text>
              <Text className="text-[#159895]">{item.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="p-4 flex-row items-center justify-center gap-4">
        <FormField
          title=""
          placeholder="Add comment..."
          value={commentText}
          handleChangeText={setCommentText}
          otherStyles="grow"
        />
        <TouchableOpacity
          onPress={handleComment}
          className="mt-4 bg-[#text-[#57C5B6]] px-4 py-2 rounded-3xl w-20 h-14 items-center justify-center"
        >
          <Text className="text-white font-psemibold">Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
