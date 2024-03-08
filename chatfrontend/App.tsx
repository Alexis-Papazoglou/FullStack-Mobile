import { SafeAreaView, Text } from "react-native";
import AuthScreen from "./AuthScreen";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import HomeScreen from "./HomeScreen";

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
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      {isLogged && user ? <HomeScreen /> : <AuthScreen />}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
