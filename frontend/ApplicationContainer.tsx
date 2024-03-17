// ApplicationContainer.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "./Context/AuthContext";
import io, { Socket } from "socket.io-client";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SERVER } from "./config";
import PostsViewForYou from "./BottomTabScreens/PostsViewForYou";
import PostsViewFollowing from "./BottomTabScreens/PostsViewFollowing";
import Profile from "./BottomTabScreens/Profile";
import { usePostsActions } from "./Context/PostsContext";
import { CreatePost } from "./Components/CreatePost";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function ApplicationContainer() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const { fetchNewPost, getUpdatedPostandReplaceOld } = usePostsActions();

  useEffect(() => {
    async function connectSocket() {
      if (!user) throw new Error("User is not defined");

      const socket = io(SERVER, {
        query: { token: user.token.value },
      });

      setSocket(socket);

      socket.on("connect", () => {
        console.log("Successfully connected to the server socket");
      });

      socket.on("new post", (message) => {
        fetchNewPost(message.id);
      });

      socket.on("post actions", (message) => {
        getUpdatedPostandReplaceOld(message.id);
      });

      socket.on("connect_error", (error) => {
        console.log("Failed to connect to the server:", error.message);
        return;
      });

      // Clean up
      return () => {
        socket.disconnect();
      };
    }

    connectSocket();
  }, [SERVER]); // server is const so it will never change this is just to make the linter happy

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "blue",
        }}
      >
        <Tab.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" color={color} size={size} />
            ),
          }}
          name="Feed"
        >
          {(props) => socket && <PostsViewForYou />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="feed" color={color} size={size} />
            ),
          }}
          name="Following"
        >
          {(props) => socket && <PostsViewFollowing />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
          name="Create"
        >
          {(props) => socket && <CreatePost />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" color={color} size={size} />
            ),
          }}
          name="Profile"
        >
          {(props) => socket && <Profile socket={socket} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
