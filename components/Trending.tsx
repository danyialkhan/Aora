import { View, Text, FlatList } from "react-native";
import { CustomModels } from "@/lib/customtypes";
import React, { FC } from "react";

interface TrendingProps {
  posts: CustomModels.Video<CustomModels.User>[];
}

const Trending: FC<TrendingProps> = ({ posts }) => {
  return (
    <FlatList<CustomModels.Video<CustomModels.User>>
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
