import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const url = process.env.EXPO_PUBLIC_API_URL;

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${url}/users/searchUsers?query=${text}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserPress = (userId: string) => {
    router.push(`/${userId}`);
  };

  return (
    <SafeAreaView className="bg-red-400 flex-1">
      <ScrollView className="flex-1">
        <View className="mt-6 px-4">
          <View className="justify-between items-start flex-row mr-4">
            <Text className="text-5xl font-pblack pt-1 mt-3 ml-4">Search</Text>
            <Image
              source={images.watermelon}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>

          <View className="flex-row justify-between items-center mt-4 mb-4">
            <SearchInput
              title="Search"
              value={searchQuery}
              placeholder="Search for users"
              handleChangeText={handleSearch}
            />
          </View>
        </View>

        {searchResults.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <EmptyState
              title="No User Found"
              subtitle="Try searching for something else"
              isSearch={true}
            />
          </View>
        ) : (
          <View className="px-4">
            {searchResults.map((item: any) => (
              <TouchableOpacity
                key={item._id}
                className="flex-row items-center p-3 rounded-3xl bg-white justify-start mb-2"
                onPress={() => handleUserPress(item._id)}
              >
                <Image
                  source={{
                    uri: item.avatar
                      ? `${url}/${item.avatar}`
                      : images.watermelon,
                  }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-4">
                  <Text className="font-psemibold text-base">
                    {item.username}
                  </Text>
                  <Text className="text-gray-600">{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
