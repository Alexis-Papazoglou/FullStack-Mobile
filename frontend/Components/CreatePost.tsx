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
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    width: "80%",
    padding: 10,
    margin: 10,
  },
});
