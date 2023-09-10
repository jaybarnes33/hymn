import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import { hymns } from "../../data/hymns";
const index = () => {
  return (
    <SafeAreaView className="px-6">
      <Text className="font-bold tracking-wide capitalize text-lg">
        Hymn of the day
      </Text>
      <View>
        <View className="flex-row items-center">
          <Text className="text-sm">Hymn 1</Text>
          <View className="h-1 w-1 mx-2  bg-black rounded-full"></View>
          <Text className="text-sm">Great is thy faithfulness</Text>
        </View>
        <Pressable>
          <Text className="text-xs text-gray-600">Open Now</Text>
        </Pressable>
      </View>

      <View className="flex-row items-center my-4 bg-white p-2 py-3 shadow rounded">
        <TextInput
          className="flex-1"
          placeholder="Enter number, name or sentence"
        />
        <Feather color={"gray"} name="search" size={16} />
      </View>

      {/* Recently Viewed */}
      <View>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold">Recently Opened</Text>
          <Text className="text-sm">See all</Text>
        </View>
        <View>
          {hymns.map((hymn) => (
            <View>
              <Text>Hymn {hymn.number}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;
