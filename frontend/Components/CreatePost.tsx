import React from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { usePostsActions } from "../Context/PostsContext";

export const CreatePost = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { createPost } = usePostsActions();

  const handleSubmit = () => {
    if (!title || !description) {
      alert("Please fill in all the fields");
      return;
    }
    createPost(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.createText}>Create Post</Text>
          <View style={styles.formContainer}>
            <Text style={styles.formText}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            <Text style={styles.formText}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    width: "70%",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  createText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formText: {
    fontSize: 18,
    margin: 10,
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
});
