import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

export default function ImageDisplay() {
  const { url } = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: url as string }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    </View>
  );
}
