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
      <View>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.author}>Author: {post.username}</Text>
        <Text>{post.description}</Text>
      </View>

      <View style={styles.buttons}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postButton: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 5,
  },
  author: {
    color: "gray",
    paddingBottom: 5,
  },
  buttons: {
    justifyContent: "center",
  },
});
