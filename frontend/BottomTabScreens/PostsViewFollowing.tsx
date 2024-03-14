import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import PostCard from "../Components/PostCard";
import { usePostsActions } from "../Context/PostsContext";
import { useAuth } from "../Context/AuthContext";

export default function PostsViewFollowing() {
  const { followingPosts, getFollowingPosts } = usePostsActions();
  const { user } = useAuth();

  useEffect(() => {
    getFollowingPosts();
  }, [user]);
  // user in the dependency because when i follow and unfollow the user changes and i need to refetch the posts

  return (
    <SafeAreaView style={styles.postContainer}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{ width: "100%", padding: 10, paddingBottom: 50 }}
        data={followingPosts}
        keyExtractor={(item) => item.id}
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
    backgroundColor: "white",
  },
});
