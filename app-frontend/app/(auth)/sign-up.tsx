import { View, Text, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const url = process.env.EXPO_PUBLIC_API_URL;
const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    if (!form.email || !form.password || !form.name) {
      alert("Please fill all fields");
      return;
    }

    router.push({
      pathname: "/complete-profile",
      params: form,
    });
  };

  return (
    <SafeAreaView className="h-full bg-red-500">
      <ScrollView>
        <View className="w-full justify-center my-6">
          <Image
            source={require("../../assets/images/watermelon.png")}
            resizeMode="contain"
            className="w-[180px] h-[170px]"
          />
          <Text className="text-5xl text-white font-pblack py-2 px-9">
            Join Melon!!
          </Text>
          <FormField
            title="Name"
            value={form.name}
            otherStyles="mt-7 mx-4 px-4"
            handleChangeText={(e) => setForm({ ...form, name: e })}
          />
          <FormField
            title="Email"
            value={form.email}
            otherStyles="mt-7 mx-4 px-4"
            handleChangeText={(e) => setForm({ ...form, email: e })}
          />
          <FormField
            title="Password"
            value={form.password}
            otherStyles="mt-7 mx-4 px-4"
            handleChangeText={(e) => setForm({ ...form, password: e })}
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7 mx-8 px-4"
            isLoading={isSubmitting}
          />
          <View className="flex-row justify-center items-center mt-4 gap-2">
            <Text className="text-white text-base font-psemibold">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="text-green-800">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
