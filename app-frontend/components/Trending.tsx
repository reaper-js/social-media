import { View, Text, FlatList } from "react-native";
import React from "react";

type TrendingProps = {
  posts: Array<{
    id: string;
  }>;
};

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text className="text-3xl"> {item.id}</Text>}
      horizontal
    />
  );
};

export default Trending;
