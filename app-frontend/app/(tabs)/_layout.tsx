import { View, Text, Image, Alert } from "react-native";
import { Tabs, Redirect, Stack, router } from "expo-router";
import { icons } from "../../constants";
import { useState } from "react";
import { LogoutModal } from "../../components/LogoutModal";
import * as SecureStore from "expo-secure-store";
import React from "react";

const url = process.env.EXPO_PUBLIC_API_URL;
const TabIcon = ({
  icon,
  color,
  name,
  focused,
}: {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}) => {
  return (
    <View className="items-center justify-center gap-1 mt-3">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      console.log(1);
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${url}/users/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await SecureStore.deleteItemAsync("userToken");
        setShowLogoutModal(false);
        router.replace("/");
      }
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const handleLogoutAll = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${url}/auth/logout-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await SecureStore.deleteItemAsync("userToken");
        setShowLogoutModal(false);
        router.replace("/");
      }
    } catch (error) {
      console.error("Logout all error:", error);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#F56565",
          tabBarInactiveTintColor: "#F6B2B2",
          tabBarStyle: {
            backgroundColor: "#2F6731",
            borderTopWidth: 1,
            borderTopColor: "#2F6731", // maybe change this later
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Feed"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "search",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.search}
                color={color}
                name="Search"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.add}
                color={color}
                name="Post"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Saved"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push("/profile");
            },
            tabLongPress: () => {
              setShowLogoutModal(true);
            },
          }}
        />
      </Tabs>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogout}
        onLogoutAll={handleLogoutAll}
      />
    </>
  );
};
export default TabsLayout;
