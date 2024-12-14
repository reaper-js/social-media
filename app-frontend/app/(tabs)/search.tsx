import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import * as SecureStore from "expo-secure-store";
import { debounce } from "lodash";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const url = process.env.EXPO_PUBLIC_API_URL;
  const debouncedSearch = useMemo(
    () => debounce((text: string) => handleSearch(text), 300),
    []
  );
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

  return (
    <SafeAreaView className="bg-red-400 flex-1 h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <FlatList
          removeClippedSubviews={false}
          windowSize={5}
          keyboardShouldPersistTaps="handled"
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({
            item,
          }: {
            item: {
              _id: string;
              avatar?: string;
              username: string;
              name: string;
            };
          }) => (
            <TouchableOpacity className="flex-row items-center p-3 rounded-3xl bg-white justify-start mr-4 ml-4 mt-1 mb-2">
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
          )}
          ListHeaderComponent={() => (
            <View className="mt-6 px-4">
              <View className="justify-between items-start flex-row mr-4">
                <View>
                  <Text className="text-5xl font-pblack pt-1 mt-3 ml-4">
                    Search
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
              <View className="flex-row justify-between items-center mt-4 mb-4">
                <SearchInput
                  {...{
                    title: "Search",
                    value: searchQuery,
                    placeholder: "Search for users",
                    handleChangeText: handleSearch,
                  }}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center mt-20">
              <EmptyState
                title="No User Found"
                subtitle="Try searching for something else"
                isSearch={true}
              />
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Search;
