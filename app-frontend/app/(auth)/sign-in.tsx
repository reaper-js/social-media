import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useGlobal } from "@/context/GlobalProvider";

const url = process.env.EXPO_PUBLIC_API_URL;
const SignIn = () => {
  const {
    value: { login },
  } = useGlobal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${url}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${data.message}`);
        return;
      }

      await login(data, data.token);
      router.replace("/home");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-[#57C5B6]">
      <View className="w-full justify-center my-6 mt-12">
        <Image
          source={require("../../assets/images/watermelon.png")}
          resizeMode="contain"
          className="w-[180px] h-[170px] ml-4"
        />
        <Text className="text-5xl text-[#002B5B] font-pblack py-2 px-9 mt-4">
          Log into Melon!
        </Text>
        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e: any) => setForm({ ...form, email: e })}
          otherStyles="mt-7 mx-4 px-4"
        />
        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e: any) => setForm({ ...form, password: e })}
          otherStyles="mt-7 mx-4 px-4"
        />

        <CustomButton
          title="Sign In"
          handlePress={submit}
          containerStyles="mt-7 mx-8 px-4 bg-[#002B5B]"
          isLoading={isSubmitting}
        />
        <View className="flex-row justify-center items-center mt-4 gap-2">
          <Text className="text-white text-base font-psemibold">
            Don't Have an account?
          </Text>
          <Link href="/sign-up" className="text-[#002B5B]">
            Sign Up
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
