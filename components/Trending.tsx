import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewToken,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { VideosType } from "@/lib/customtypes";
import React, { FC, useRef, useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";

interface TrendingProps {
  posts: VideosType[];
}

interface TrendingItemProps {
  item: VideosType;
  activeItem: VideosType;
}

const zoomIn = {
  0: { opacity: 1, scale: 0.9 },
  0.5: { opacity: 1, scale: 1 },
  1: { opacity: 1, scale: 1.1 },
};

const zoomOut = {
  0: { opacity: 1.1, scale: 1 },
  0.5: { opacity: 1, scale: 1 },
  1: { opacity: 1, scale: 0.9 },
};

const TrendingItem: FC<TrendingItemProps> = ({ item, activeItem }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handlePlaybackStatusUpdate = (status: any) => {
    console.log("Video player status: ", status);
    setLoading(status.isBuffering);

    if (status.didJustFinish) {
      setIsPlaying(false);
    } else if (status.error) {
      setIsPlaying(false);
    }
  };

  return (
    <Animatable.View
      animation={activeItem.id === item.id ? zoomIn : zoomOut}
      className="mr-5"
    >
      {isPlaying ? (
        <View className="relative justify-center items-center">
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#ffffff"
              className="w-12 h-12 justify-center absolute"
            />
          )}
          <Video
            ref={videoRef}
            className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
            source={{
              uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
            }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        </View>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setIsPlaying(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending: FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanges = ({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken<VideosType>[];
    changed: ViewToken<VideosType>[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item);
    }
  };

  return (
    <FlatList<VideosType>
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TrendingItem item={item} activeItem={activeItem} />
      )}
      onViewableItemsChanged={viewableItemsChanges}
      horizontal={true}
      viewabilityConfig={{
        viewAreaCoveragePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
};

export default Trending;
