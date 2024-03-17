import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Socket } from "socket.io-client";

export default function Profile({ socket }: { socket: Socket }) {
  const { user, logOut } = useAuth();
  return (
    <SafeAreaView style={styles.profileContainer}>
      <Text style={styles.profileText}>Profile</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.usernameText}>Username: {user?.username}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => logOut(socket)}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  profileText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  usernameText: {
    fontSize: 18,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
});
