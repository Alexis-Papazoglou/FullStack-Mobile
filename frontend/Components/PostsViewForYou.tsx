import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Post } from "../interfaces";
import PostCard from "./PostCard";

export default function PostsViewForYou({ posts }: { posts: Post[] }) {
  return (
    <SafeAreaView style={styles.postContainer}>
      <FlatList
        style={{ width: "100%", padding: 10 }}
        data={posts}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
  },
});
