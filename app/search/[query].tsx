import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { VideosType } from "@/lib/customtypes";
import { searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, isLoading } = useAppwrite<VideosType>(() =>
    searchPosts(finalQuery)
  );

  const finalQuery = Array.isArray(query) ? query[0] : query;

  useEffect(() => {}, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList<VideosType>
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            prompt={item.prompt}
            video={item.video}
            user={item.user}
            id={item.id}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View>
              <Text className="font-pmedium text-sm text-gray-100 ">
                Search Results
              </Text>
              <Text className="text-white text-2xl font-psemibold">
                {query}
              </Text>
            </View>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={finalQuery} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            subtitle="No videos found"
            title="No video found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
