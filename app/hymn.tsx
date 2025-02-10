import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Hymn } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import clsx from "clsx";

const Details = () => {
  const { content, language = "twi" } = useLocalSearchParams() as {
    content: string;
    language: "english" | "twi";
  };
  const parsed = JSON.parse(content as string) as Hymn;
  const { navigate } = useRouter();
  const item = parsed[language];

  const [liked, setLiked] = React.useState(false);

  useEffect(() => {
    (async () => {
      const likedSongs = JSON.parse(
        (await AsyncStorage.getItem("likedSongs")) || "[]"
      );
      setLiked(likedSongs.includes(parsed.number));
    })();
  }, [parsed.number]);

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
    <LinearGradient colors={["#3b82f6", "#2563eb"]} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView>
        <View className="px-4 py-3 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => navigate({ pathname: "/", params: { language } })}
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

        <View className="bg-white py-4 min-h-screen">
          <ScrollView
            className="flex-1 px-4 "
            contentContainerStyle={{ paddingBottom: 300 }}
          >
            {item.content.map((verse, index) => {
              const isChorus =
                content.toLowerCase().includes("chorus") ||
                content.toLowerCase().includes("nyeso");
              return (
                <View key={index} className="py-4 px-4 mb-4  rounded-xl ">
                  {!verse[0].toLowerCase().includes("nyeso") &&
                    verse[0] !== "Chorus" && (
                      <Text className="text-blue-900 text-xl font-bold ">
                        {isChorus ? (index < 1 ? index + 1 : index) : index + 1}
                        .
                      </Text>
                    )}
                  <Text className={clsx(["text-2xl leading-relaxed "])}>
                    {verse.join("\n")}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Details;
