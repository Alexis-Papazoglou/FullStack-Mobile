import { useAuth } from "../Context/AuthContext";
import { Post, User } from "../interfaces";
import { useCheckToken } from "./useCheckToken";
import * as SecureStore from "expo-secure-store";

export function useUpdateFollowing(user: User, post: Post) {
  const isTokenOk = useCheckToken();
  const { setUser } = useAuth();

  const followUser = async () => {
    if (!user) throw new Error("User is not defined");

    if (!isTokenOk()) return;

    try {
      const response = await fetch(
        `http://192.168.1.19:3000/users/followUser/${user.username}/${post.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.value}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, following: data.following };
        setUser(updatedUser);
        await SecureStore.setItemAsync(
          "following",
          JSON.stringify(updatedUser.following)
        );
      }
    } catch (error) {
      throw new Error("Something went wrong with following user");
    }
  };

  const unfollowUser = async () => {
    if (!user) throw new Error("User is not defined");

    if (!isTokenOk()) return;

    try {
      const response = await fetch(
        `http://192.168.1.19:3000/users/unfollowUser/${user.username}/${post.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.value}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, following: data.following };
        setUser(updatedUser);
        await SecureStore.setItemAsync(
          "following",
          JSON.stringify(updatedUser.following)
        );
      }
    } catch (error) {
      throw new Error("Something went wrong with unfollow user");
    }
  };

  return { followUser, unfollowUser };
}
