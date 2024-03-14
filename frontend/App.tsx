import { SafeAreaView, Text } from "react-native";
import AuthScreen from "./AuthScreen";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { PostsProvider } from "./Context/PostsContext"; // import PostsProvider

import ApplicationContainer from "./ApplicationContainer";

function MainApp() {
  const { user, isLogged, loading } = useAuth();

  if (loading) {
    return (
      <>
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
