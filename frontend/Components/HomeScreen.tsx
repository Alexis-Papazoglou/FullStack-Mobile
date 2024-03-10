import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useCheckToken } from "../Hooks/useCheckToken";
import io, { Socket } from "socket.io-client";
import { Post, User } from "../interfaces";
import { CreatePost } from "./CreatePost";
import PostsViewForYou from "./PostsViewForYou";
import PostsViewFollowing from "./PostsViewFollowing";

export default function HomeScreen() {
  const [isPostModalVisible, setPostModalVisible] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(0);
  const { user, logOut } = useAuth();
  const isTokenOk = useCheckToken();
  const socketRef = useRef<Socket | undefined>(undefined);

  if (!user) {
    throw new Error(
      "Something goes wrong with authentication! User is supposed to exist."
    );
  }

  useEffect(() => {
    getFollowingPosts();
    getPosts();
  }, [user]);

  useEffect(() => {
    async function connectSocket() {
      if (!user) throw new Error("User is not defined");

      //CHECK IF TOKEN IS STILL VALID
      const tokenOk = await isTokenOk();
      if (!tokenOk) return;

      const socket = io("http://192.168.1.19:3000/", {
        query: { token: user.token.value },
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Successfully connected to the server socket");
      });

      socket.on("new post", (message) => {
        console.log("New post received, executing getPosts");
        getPosts();
        console.log(message);
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
  }, []);

  async function createPost(title: string, description: string) {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch("http://192.168.1.19:3000/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token.value}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        username: user.username,
      }),
    });

    const data = await res.json();
    console.log(data);
  }

  async function getPosts() {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch("http://192.168.1.19:3000/posts/getPosts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token.value}`,
      },
    });
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const data = await res.json();
    setPosts(data.posts);
  }

  async function getFollowingPosts() {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch(
      `http://192.168.1.19:3000/posts/getFollowingPosts/${user.username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token.value}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const data = await res.json();
    setFollowingPosts(data.posts);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome: {user.username}</Text>
      <View style={styles.pageSelectorContainer}>
        <TouchableOpacity onPress={() => setPage(0)}>
          <Text style={[styles.selectorText, page === 0 ? { color: "red" } : {}]}>
            For you
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPage(1)}>
          <Text style={[styles.selectorText, page === 1 ? { color: "red" } : {}]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>
      {page === 0 ? (
        <PostsViewForYou posts={posts} />
      ) : (
        <PostsViewFollowing posts={followingPosts} />
      )}

      <TouchableOpacity
        style={styles.postButton}
        onPress={() => setPostModalVisible(true)}
      >
        <Text>Create Post</Text>
      </TouchableOpacity>
      <CreatePost
        visible={isPostModalVisible}
        onClose={() => setPostModalVisible(false)}
        createPost={createPost}
      />
      <TouchableOpacity onPress={() => logOut(socketRef.current)}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center", // or "space-between"
  },
  postButton: {
    backgroundColor: "lightblue",
    padding: 10,
    margin: 10,
  },
  pageSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 10,
  },
  selectorText: {
    fontSize: 20,
  },
});
