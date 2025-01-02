import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import { CustomModels } from "@/lib/customtypes";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";

const VideoCard: FC<CustomModels.Video<CustomModels.User>> = ({
  title,
  thumbnail,
  video,
  prompt,
  id,
  user: { userName, avatar },
}) => {
  const videoRef = useRef<Video>(null);
  const [play, setPlay] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handlePlaybackStatusUpdate = (status: any) => {
    console.log("Video player status: ", status);
    setLoading(status.isBuffering);

    if (status.didJustFinish) {
      setPlay(false);
    } else if (status.error) {
      setPlay(false);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {userName}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {play ? (
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
            className="w-full h-60 rounded-xl mt-3"
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
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
