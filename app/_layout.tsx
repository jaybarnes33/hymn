import React from "react";
import { Stack } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/context/theme";

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  async function checkFirstLaunch() {
    const value = await AsyncStorage.getItem("alreadyLaunched");
    if (value === null) {
      await AsyncStorage.setItem("alreadyLaunched", "true");
      setIsFirstLaunch(true);
    } else {
      setIsFirstLaunch(false);
    }
  }

  return (
    <ThemeProvider>
      <StatusBar translucent />
      <Stack screenOptions={{ navigationBarHidden: true, headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
