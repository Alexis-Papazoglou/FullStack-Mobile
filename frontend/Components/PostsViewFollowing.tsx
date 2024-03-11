import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Post } from "../interfaces";
import PostCard from "./PostCard";

export default function PostsViewFollowing({ posts }: { posts: Post[] }) {
  return (
    <View style={styles.postContainer}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{ width: "100%", padding: 10, paddingBottom: 50 }}
        data={posts}
        keyExtractor={(item) => item.title}
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
