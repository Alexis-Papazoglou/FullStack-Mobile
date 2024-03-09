import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";

interface CreatePostProps {
  visible: boolean;
  onClose: () => void;
  createPost: (title: string, description: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  visible,
  onClose,
  createPost,
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = () => {
    createPost(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
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
        <Button title="Close" onPress={onClose} />
      </SafeAreaView>
    </Modal>
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
