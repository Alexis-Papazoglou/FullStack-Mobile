import { SafeAreaView, Text, StatusBar } from "react-native";
import AuthScreen from "./AuthScreen";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { PostsProvider } from "./Context/PostsContext"; // import PostsProvider

import ApplicationContainer from "./ApplicationContainer";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]); // Ignore log notification by message

function MainApp() {
  const { user, isLogged, loading } = useAuth();

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Loading...</Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      {isLogged && user ? (
        <PostsProvider>
          <ApplicationContainer />
        </PostsProvider>
      ) : (
        <AuthScreen />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
