import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Comment } from "../interfaces";

interface CommentsContainerProps {
  comments: Comment[];
  visible: boolean;
  handleCommentSubmit: () => void;
  commentText: string;
  setCommentText: (text: string) => void;
}

export default function CommentsContainer({
  comments,
  visible,
  handleCommentSubmit,
  commentText,
  setCommentText,
}: CommentsContainerProps) {
  if (!visible) return null;

  function renderItem({ item }: { item: Comment }) {
    return (
      <View style={styles.oneCommentContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "600" }}>{item.username}:</Text>
          <Text> {item.comment}</Text>
        </View>
        <Text style={{ fontWeight: "200" }}>{item.timestamp}:</Text>
      </View>
    );
  }

  return (
    <View style={styles.commentsContainer}>
      <Text style={styles.header}>Comment Section</Text>
      <View style={styles.addCommentContainer}>
        <TextInput
          placeholder="Add a comment"
          value={commentText}
          onChangeText={setCommentText}
          style={{ width: "80%" }}
        />
        <TouchableOpacity onPress={handleCommentSubmit}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={comments} renderItem={({ item }) => renderItem({ item })} />
    </View>
  );
}

const styles = StyleSheet.create({
  commentsContainer: {
    marginVertical: 10,
    padding: 4,
  },
  header: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  addCommentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    borderColor: "lightgrey",
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
  },
  oneCommentContainer: {
    flexDirection: "column",
    padding: 4,
    marginVertical: 2,
  },
});
