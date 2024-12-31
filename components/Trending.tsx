import { View, Text, FlatList } from "react-native";
import React, { FC } from "react";

interface TrendingProps {
  posts: { id: number }[];
}

const Trending: FC<TrendingProps> = ({ posts }) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}
      horizontal={true}
    />
  );
};

export default Trending;
