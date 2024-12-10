import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import Search from "../search/[query]";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";

const Home = () => {
  return (
    <SafeAreaView className="bg-red-400 flex-1">
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text className="text-3xl"> {item.id}</Text>}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6 mr-4">
              <View>
                <Text className="text-4xl font-pblack pt-1 mt-3">Feed</Text>
              </View>
              <View>
                <Image
                  source={images.watermelon}
                  className="w-14 h-14"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput
              {...{
                title: "Search",
                value: "",
                placeholder: "Search for Posts",
                handleChangeText: () => {},
              }}
            />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular mb-3"> Latest Posts</Text>
              <Trending posts={[{ id: "1" }, { id: "0" }, { id: "3" }]} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
