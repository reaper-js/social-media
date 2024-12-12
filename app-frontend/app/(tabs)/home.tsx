import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
// import Search from "../search/[query]";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const items: Array<{ id: number }> = [{ id: 1 }, { id: 2 }, { id: 3 }];
  return (
    <SafeAreaView className="bg-red-400 flex-1 h-full">
      <FlatList
        // data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text className="text-3xl"> {item.id}</Text>}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6 mr-4">
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
            <View className="flex-row justify-between items-center -mt-4">
              <SearchInput
                {...{
                  title: "Search",
                  value: "",
                  placeholder: "Search for Posts",
                  handleChangeText: () => {},
                }}
              />
            </View>
            <View className="w-full flex-1 pt-5 pb-8">
              {/* <Text className="text-lg font-pregular mb-3"> Latest Posts</Text>
              <Trending posts={[{ id: "1" }, { id: "0" }, { id: "3" }]} /> */}
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
