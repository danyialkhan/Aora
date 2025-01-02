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
import React, { FC, useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent, useEventListener } from "expo";

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
  const [isVideoPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const player = useVideoPlayer(item.video, (player) => {
    player.loop = false;
  });

  // Listen for status changes to handle loading and idle states
  useEventListener(player, "statusChange", ({ status }) => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
    if (status === "idle") {
      setIsPlaying(false); // Show the thumbnail when the video stops
    }
  });

  return (
    <Animatable.View
      animation={activeItem.id === item.id ? zoomIn : zoomOut}
      className="mr-5"
    >
      {isVideoPlaying ? (
        <View className="relative">
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#ffffff"
              style={styles.loadingIndicator}
            />
          )}
          <VideoView
            style={{ height: 72, width: 52 }}
            className="w-52 h-72 rounded-35 mt-3 bg-white/10"
            player={player}
          />
        </View>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            if (!isVideoPlaying) {
              setIsPlaying(true); // Show the video player
              player.play(); // Start playing the video
            }
          }}
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

const styles = StyleSheet.create({
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default Trending;
