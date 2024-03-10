import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Post } from "../interfaces";
import { useAuth } from "../Context/AuthContext";
import { useUpdateFollowing } from "../Hooks/useUpdateFollowing";

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();

  if (!user) return null;

  const { followUser, unfollowUser } = useUpdateFollowing(user, post);

  const isFollowing = user.following.includes(post.username);

  return (
    <View style={styles.postContainer}>
      <Text>{post.title}</Text>
      <Text>{post.description}</Text>
      <Text>{post.username}</Text>

      {!isFollowing && user.username !== post.username && (
        <TouchableOpacity style={styles.postButton} onPress={followUser}>
          <Text>Follow User</Text>
        </TouchableOpacity>
      )}
      {isFollowing && user.username !== post.username && (
        <TouchableOpacity onPress={unfollowUser} style={styles.postButton}>
          <Text>Unfollow</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  postButton: {
    backgroundColor: "lightblue",
    padding: 10,
    margin: 10,
  },
});
