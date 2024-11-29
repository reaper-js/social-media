import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {};

  return (
    <SafeAreaView className="h-full bg-red-500">
      <View className="w-full justify-center my-6">
        <Image
          source={require("../../assets/images/watermelon.png")}
          resizeMode="contain"
          className="w-[180px] h-[170px]"
        />
        <Text className="text-5xl text-white font-pblack py-2 px-9">
          Log into Melon!
        </Text>
        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles="mt-7 mx-4 px-4"
          keyboardType="email-address"
        />
        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          otherStyles="mt-7 mx-4 px-4"
          keyboardType="email-address"
        />

        <CustomButton
          title="Sign In"
          handlePress={submit}
          containerStyles="mt-7 mx-8 px-4"
          isLoading={isSubmitting}
        />
        <View className="flex-row justify-center items-center mt-4 gap-2">
          <Text className="text-white text-base font-psemibold">
            Don't Have an account?
          </Text>
          <Link href="/sign-up" className="text-green-800">
            Sign Up
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
