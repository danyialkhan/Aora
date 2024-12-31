import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4 ">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="font-pmedium text-sm text-gray-100">{title}</Text>
      <Text className="text-white text-xl text-center font-psemibold">
        {subtitle}
      </Text>
      <CustomButton
        containerStyles="w-full my-5"
        title="Create Video"
        handlePress={() => router.push("/create")}
      />
    </View>
  );
};

export default EmptyState;
