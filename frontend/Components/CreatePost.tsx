import React from "react";
import { Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import { usePostsActions } from "../Context/PostsContext";

export const CreatePost = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { createPost } = usePostsActions();

  const handleSubmit = () => {
    createPost(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    width: "60%",
    padding: 12,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
});
