import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import PostCard from "../Components/PostCard";
import { usePostsActions } from "../Context/PostsContext";
import { useAuth } from "../Context/AuthContext";

export default function PostsViewForYou() {
  const { posts, getPosts } = usePostsActions();
  const { user } = useAuth();

  useEffect(() => {
    getPosts();
  }, [user]); // user in the dependency because when i follow and unfollow the user changes and i need to refetch the posts

  return (
    <View style={styles.postContainer}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{ width: "100%", padding: 10, paddingBottom: 50 }}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});