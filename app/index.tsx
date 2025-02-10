"use client";

import { useEffect, useState } from "react";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { hymns } from "@/data/hymns";
import clsx from "clsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Hymn } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results] = useState(hymns);
  const { navigate } = useRouter();
  const [showLiked, setShowLiked] = useState(false);

  const { language: lang = "twi" } = useLocalSearchParams() as {
    language: "twi" | "english";
  };
  const languages: ["twi", "english"] = ["twi", "english"];
  const [language, setLanguage] = useState<"twi" | "english">(lang);

  const filteredResults = results.filter((item) => {
    const title = item[language].title
      ? item[language].title.toLowerCase()
      : "";
    const number = item.number.toLowerCase();
    return title.includes(query.toLowerCase()) || number.includes(query);
  });

  const [liked, setLiked] = useState<Hymn[]>([]);
  useEffect(() => {
    (async () => {
      const likedSongs = JSON.parse(
        (await AsyncStorage.getItem("likedSongs")) || "[]"
      );
      //@ts-ignore
      setLiked(results.filter((item) => likedSongs.includes(item.number)));
    })();
  }, [results]);

  const displayedResults = showLiked ? liked : filteredResults;

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#3b82f6", "#2563eb"]}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 relative ">
        <View>
          <View className="p-5  rounded-xl  gap-y-4">
            <View className="bg-white/20 rounded-2xl flex-row items-center px-4 backdrop-blur-lg">
              <Feather name="search" size={20} color="#fff" />
              <TextInput
                className="flex-1 h-12 px-3 text-white text-lg"
                placeholder="Search by phrase or number"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={query}
                onChangeText={setQuery}
              />
              {!!query && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Feather name="x" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row gap-x-3 px-1">
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  activeOpacity={0.8}
                  onPress={() => setLanguage(lang)}
                  className={clsx(
                    "flex-1 py-2 rounded-xl border-2",
                    language === lang
                      ? "bg-white border-white"
                      : "border-white/30 bg-transparent"
                  )}
                  disabled={language === lang}
                >
                  <Text
                    className={clsx(
                      "text-lg font-semibold text-center capitalize",
                      language === lang ? "text-blue-600" : "text-white"
                    )}
                  >
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View className="flex-1 bg-white min-h-screen">
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
            <Text className="text-2xl font-bold ">
              {showLiked ? "Liked Songs" : "All Songs"}
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setShowLiked(!showLiked)}
            >
              <Text className="text-orange-500 mr-2 text-">
                {showLiked ? "All Songs" : "Liked Songs"}
              </Text>
              <Ionicons
                name={showLiked ? "heart" : "heart-outline"}
                size={24}
                color="#f97316"
              />
            </TouchableOpacity>
          </View>

          <FlatList
            //@ts-ignore
            data={displayedResults}
            keyExtractor={(item) => item.number}
            contentContainerStyle={{ paddingBottom: 500 }}
            renderItem={({ item }) => {
              if (!item[language].content.length) {
                return null;
              }

              return (
                <TouchableOpacity
                  onPress={() =>
                    navigate({
                      pathname: "/hymn",
                      params: { content: JSON.stringify(item), language },
                    })
                  }
                  className="flex-row px-4 py-3.5 border-b border-gray-100 items-center"
                >
                  <Text className="font-semibold text-xl w-12">
                    {item.number}.
                  </Text>
                  <Text className="flex-1 text-xl capitalize ">
                    {item[language].title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
