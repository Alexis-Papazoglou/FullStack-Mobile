import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { SERVER } from "../config";

// THIS CUSTOM HOOK IS USED TO CHECK IF THE TOKEN IS STILL VALID
// WE WILL CALL THIS THROUGHOUT THE APP TO MAKE SURE THE USER TOKEN IS NOT EXPIRED
export function useCheckToken() {
  const { logOut, user } = useAuth();

  async function isTokenOk() {
    try {
      if (!user) throw new Error();
      const res = await fetch(`${SERVER}/verifyToken`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token.value}`,
        },
      });
      if (res.ok) {
        return true;
      } else {
        console.log(await res.json());
        Alert.alert("Your session has expired");
        logOut(undefined);
        return false;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return isTokenOk;
}
