import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";

export default function HomeScreen() {
  const { user, logOut } = useAuth();

  console.log(user);
  if (!user) {
    throw new Error(
      "Something goes wrong with authentication! User is supposed to exist."
    );
  }

  async function makeJWTReq() {
    console.log(user?.token.value);
    try {
      if (!user) return;
      const res = await fetch("http://192.168.1.19:3000/get/hello", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token.value}`,
        },
      });
      // const data = await res.json();
      console.log(await res.json());
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>Welcome: {user.username}</Text>
      <TouchableOpacity onPress={logOut}>
        <Text>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={makeJWTReq}>
        <Text>Make request with jwt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
