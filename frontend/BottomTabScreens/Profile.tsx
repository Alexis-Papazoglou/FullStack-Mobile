import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Socket } from "socket.io-client";

export default function Profile({ socket }: { socket: Socket }) {
  const { user, logOut } = useAuth();
  return (
    <SafeAreaView style={styles.profileContainer}>
      <Text>Profile</Text>
      <Text>{user?.username}</Text>
      <TouchableOpacity onPress={() => logOut(socket)}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
