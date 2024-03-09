import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Post } from "../interfaces";

export default function PostsView({ posts }: { posts: Post[] }) {
  console.log(posts);
  return (
    <SafeAreaView style={styles.postContainer}>
      <Text>Posts</Text>
      <FlatList
        style={{ width: "100%", padding: 10 }}
        data={posts}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.username}</Text>
          </View>
        )}
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
