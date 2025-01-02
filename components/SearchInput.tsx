import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { FC, useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput: FC<SearchInputProps> = ({ initialQuery = "" }) => {
  const [isFocused, setIsFocused] = useState(false);

  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const handleChangeText = (value: string) => setQuery(value);

  return (
    <View
      className={`border-2 ${
        isFocused ? "border-secondary" : "border-black-200"
      } w-full h-16 bg-black-100 rounded-2xl items-center px-4 mt-2 flex-row space-x-4`}
    >
      <TextInput
        className="flex-1 text-white font-pregular text-base mt-0.5"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search across db."
            );
          }

          if (pathName.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image className="w-5 h-5" resizeMode="contain" source={icons.search} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
