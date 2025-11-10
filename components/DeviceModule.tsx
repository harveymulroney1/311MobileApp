import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface DeviceModuleProps {
  title: string;
  onPress: () => void;
}
export default function DeviceModule({ title, onPress }: DeviceModuleProps) {
  return (
    <TouchableOpacity style={styles.device} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  device: {
    backgroundColor: "blue",
  },
  text: {
    fontSize: 16,
    color: "white",
    fontWeight: 600,
  },
});
