import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";

const SignUp = () => {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password || !form.userName) {
      Alert.alert("Error", "please fill in the required details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.userName);

      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up to Aora
          </Text>
          <FormField
            title="User Name"
            value={form.userName}
            handleChangeText={(e) =>
              setForm({
                ...form,
                userName: e,
              })
            }
            otherStyles="mt-7"
            keyboardType="text"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) =>
              setForm({
                ...form,
                email: e,
              })
            }
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(p) =>
              setForm({
                ...form,
                password: p,
              })
            }
            otherStyles="mt-7"
            keyboardType="password"
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            isLoading={isSubmitting}
            containerStyles="mt-7"
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-lg font-psemibold text-secondary">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
