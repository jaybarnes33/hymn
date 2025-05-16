import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Appearance,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Hymn } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import clsx from "clsx";
import { capitalizeFirstLetter } from "@/utils/text";
import { useTheme } from "@/context/theme";

const Details = () => {
  const { content, language = "twi" } = useLocalSearchParams() as {
    content: string;
    language: "english" | "twi";
  };
  const parsed = JSON.parse(content as string) as Hymn;
  const { push } = useRouter();
  const item = parsed[language];
  const { isDark } = useTheme();

  const [liked, setLiked] = React.useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      const likedSongs = JSON.parse(
        (await AsyncStorage.getItem("likedSongs")) || "[]"
      );
      setLiked(likedSongs.includes(parsed.number));
    })();
  }, [parsed.number]);

  useEffect(() => {
    // Reset scroll position when content changes
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [content]);

  const handleLike = async () => {
    setLiked(!liked);
    let likedSongs = JSON.parse(
      (await AsyncStorage.getItem("likedSongs")) || "[]"
    );
    if (likedSongs.includes(parsed.number)) {
      likedSongs = likedSongs.filter((song: string) => song !== parsed.number);
    } else {
      likedSongs.push(parsed.number);
    }
    await AsyncStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  };

  return (
    <LinearGradient
      colors={isDark ? ["#1e293b", "#0f172a"] : ["#3b82f6", "#2563eb"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView>
        <View className="px-4 py-3 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => push({ pathname: "/", params: { language } })}
            className="bg-white/20 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 px-4">
            <Text className="text-white uppercase text-lg font-semibold text-center">
              {parsed.number}. {item.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLike}
            className="bg-white/20 p-2 rounded-full"
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color="#fecdd3"
            />
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-gray-900 py-4 min-h-screen">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 "
            contentContainerStyle={{ paddingBottom: 300 }}
          >
            {item.content.map((verse, index) => {
              const isChorus =
                content.toLowerCase().includes("chorus") ||
                content.toLowerCase().includes("nyeso");

              // Find the chorus verse
              const chorusVerse = item.content.find(
                (v) => v[0].toLowerCase().includes("nyeso") || v[0] === "Chorus"
              );

              return (
                <React.Fragment key={index}>
                  {!verse[0].toLowerCase().includes("nyeso") &&
                    verse[0] !== "Chorus" && (
                      <>
                        <View className="py-4 px-4 mb-4 border-b border-gray-200 rounded-xl">
                          <Text className="text-blue-900 dark:text-blue-500 text-xl font-bold">
                            {isChorus
                              ? index < 1
                                ? index + 1
                                : index
                              : index + 1}
                            .
                          </Text>
                          <Text
                            className={clsx([
                              "text-2xl leading-relaxed dark:text-white",
                            ])}
                          >
                            {verse
                              .map((line) => capitalizeFirstLetter(line))
                              .join("\n")}
                          </Text>
                        </View>

                        {/* Display chorus after each verse if it exists */}
                        {chorusVerse && (
                          <View className="py-4 px-4 mb-4 border-b border-gray-200 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                            <Text className="text-blue-900 dark:text-blue-500 text-xl font-bold">
                              {language === "english" ? "Chorus" : "Nyesoɔ"}
                            </Text>
                            <Text
                              className={clsx([
                                "text-2xl leading-relaxed dark:text-white",
                              ])}
                            >
                              {chorusVerse
                                .slice(1)
                                .map((line) => capitalizeFirstLetter(line))
                                .join("\n")}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Details;
