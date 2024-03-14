import { StyleSheet, TextInput, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";

export default function AuthScreen() {
  const { logIn, createAccount, lastError } = useAuth();
  const [username, setUsername] = useState<string>("Alex");
  const [password, setPassword] = useState<string>("test");

  return (
    <View style={styles.container}>
      {lastError && <Text style={{ color: "red" }}>{lastError.message}</Text>}
      <TextInput
        value={username}
        style={styles.input}
        placeholder="Username.."
        onChangeText={setUsername}
      />
      <TextInput
        value={password}
        style={styles.input}
        placeholder="Password.."
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={() => logIn(username, password)}
        style={styles.button}
      >
        <Text style={styles.textStyle}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => createAccount(username, password)}
        style={styles.button}
      >
        <Text style={styles.textStyle}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    margin: 10,
    padding: 10,
    width: 200,
    height: 40,
    borderWidth: 0.5,
    borderColor: "lightgray",
    borderRadius: 10,
  },
  button: {
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    padding: 5,
    margin: 10,
    backgroundColor: "blue",
    borderRadius: 10,
  },
  textStyle: {
    color: "white",
  },
});
