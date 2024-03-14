import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Post } from "../interfaces";
import { useAuth } from "../Context/AuthContext";
import { useUpdateFollowing } from "../Hooks/useUpdateFollowing";
import { usePostsActions } from "../Context/PostsContext";

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const { likePost, commentPost } = usePostsActions();
  const [commentText, setCommentText] = useState("");

  if (!user) return null;
  const { followUser, unfollowUser } = useUpdateFollowing(user, post);
  const isFollowing = user.following.includes(post.username);

  function handleCommentSubmit() {
    if (!commentText) {
      Alert.alert("Comment cannot be empty");
      return;
    }
    commentPost(post.id, commentText);
    setCommentText("");
  }

  return (
    <View style={styles.postContainer}>
      <View>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.author}>Author: {post.username}</Text>
        <Text>{post.description}</Text>
        <Text>Time: {post.timestamp}</Text>
        <Text>Likes: {post.likes.length}</Text>
        <Text>Comments: {post.comments.length}</Text>
        <TouchableOpacity onPress={() => likePost(post.id)}>
          <Text>Like / Dislike</Text>
        </TouchableOpacity>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Comment here..."
        />
        <TouchableOpacity onPress={handleCommentSubmit}>
          <Text>Comment</Text>
        </TouchableOpacity>
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
