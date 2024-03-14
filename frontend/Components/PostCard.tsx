import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Post } from "../interfaces";
import { useAuth } from "../Context/AuthContext";
import { useUpdateFollowing } from "../Hooks/useUpdateFollowing";
import { usePostsActions } from "../Context/PostsContext";
import CommentsContainer from "./CommentsContainer";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const { likePost, commentPost } = usePostsActions();
  const [commentText, setCommentText] = useState("");
  const [commentContainerVisible, setCommentContainerVisible] = useState(false);

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

  function toggleCommentContainer() {
    setCommentContainerVisible(!commentContainerVisible);
  }

  return (
    <View style={styles.postContainer}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={{ fontWeight: "200" }}>{post.timestamp}</Text>
          <Text style={styles.author}>Author: {post.username}</Text>
          <Text>{post.description}</Text>
          <View style={styles.buttonsContainer}></View>
        </View>

        {/* BUTTONS */}

        <View style={styles.buttonsContainer}>
          {!isFollowing && user.username !== post.username && (
            <TouchableOpacity style={styles.followBtn} onPress={followUser}>
              <Text>Follow User</Text>
            </TouchableOpacity>
          )}
          {isFollowing && user.username !== post.username && (
            <TouchableOpacity onPress={unfollowUser} style={styles.followBtn}>
              <Text>Unfollow</Text>
            </TouchableOpacity>
          )}
          <View style={styles.likesAndComments}>
            <TouchableOpacity
              style={styles.likesAndCommentsBtn}
              onPress={() => likePost(post.id)}
            >
              <Ionicons name="heart" size={24} color="black" />
            </TouchableOpacity>
            <Text>{post.likes.length}</Text>
            <TouchableOpacity
              style={styles.likesAndCommentsBtn}
              onPress={toggleCommentContainer}
            >
              <FontAwesome name="comments-o" size={24} color="black" />
            </TouchableOpacity>
            <Text>{post.comments.length}</Text>
          </View>
        </View>
      </View>
      <CommentsContainer
        comments={post.comments}
        commentText={commentText}
        setCommentText={setCommentText}
        visible={commentContainerVisible}
        handleCommentSubmit={handleCommentSubmit}
      />
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
    borderColor: "lightgray",
    borderWidth: 0.5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: "space-between",
  },
  author: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
  contentContainer: {
    width: "70%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 5,
  },
  buttonsContainer: {
    width: "30%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  followBtn: {
    padding: 10,
    backgroundColor: "white",
    borderColor: "lightgray",
    borderWidth: 0.5,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  likesAndComments: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likesAndCommentsBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
});
