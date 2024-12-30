import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";

interface FormFieldProps {
  title: string;
  value?: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: "email-address" | "password" | "text";
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType = "text",
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-pmedium text-green-100 ">{title}</Text>
      <View
        className={`border-2 ${
          isFocused ? "border-secondary" : "border-black-200"
        } w-full h-16 bg-black-100 rounded-2xl items-center px-4 mt-2 flex-row`}
      >
        <TextInput
          className="flex-1 w-full h-full text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={keyboardType === "password" && !showPassword}
          {...props}
          //   style={{ backgroundColor: "red" }}
        />
        {keyboardType === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-6 h-6 justify-end"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
