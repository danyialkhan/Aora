import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { FC, useState } from "react";
import { icons, images } from "@/constants";

interface FormFieldProps {
  value?: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
}

const SearchInput: FC<FormFieldProps> = ({
  value = "",
  placeholder = "",
  handleChangeText,
  otherStyles = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`border-2 ${
        isFocused ? "border-secondary" : "border-black-200"
      } w-full h-16 bg-black-100 rounded-2xl items-center px-4 mt-2 flex-row space-x-4`}
    >
      <TextInput
        className="flex-1 text-white font-pregular text-base mt-0.5"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
        //   style={{ backgroundColor: "red" }}
      />
      <TouchableOpacity>
        <Image className="w-5 h-5" resizeMode="contain" source={icons.search} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
