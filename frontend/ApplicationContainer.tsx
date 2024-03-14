// ApplicationContainer.tsx
import React, { useEffect, useState } from "react";
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
      <Tab.Navigator>
        <Tab.Screen name="Feed">
          {(props) => socket && <PostsViewForYou />}
        </Tab.Screen>
        <Tab.Screen name="Following">
          {(props) => socket && <PostsViewFollowing />}
        </Tab.Screen>
        <Tab.Screen name="Create">{(props) => socket && <CreatePost />}</Tab.Screen>
        <Tab.Screen name="Profile">
          {(props) => socket && <Profile socket={socket} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
