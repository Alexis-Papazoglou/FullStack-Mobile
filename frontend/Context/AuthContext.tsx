import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { Socket } from "socket.io-client";
import { User, Token } from "../interfaces";

interface AuthProps {
  isLogged: boolean;
  loading: boolean;
  logIn(username: string, password: string): Promise<any>;
  createAccount(username: string, password: string): Promise<any>;
  logOut(socketRef: Socket | undefined): Promise<any>;
  lastError: Error | undefined;
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const SERVER = "http://192.168.1.19:3000";
const AuthContext = createContext<AuthProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();
  const [lastError, setLastError] = useState<Error | undefined>();

  // Handle Case token expired
  useEffect(() => {
    async function getToken() {
      setLoading(true);
      let tok = await SecureStore.getItemAsync("token");
      let exp = await SecureStore.getItemAsync("expiration");
      let usr = await SecureStore.getItemAsync("user");
      let following = await SecureStore.getItemAsync("following");

      if (tok && usr && exp && following) {
        //TOKEN EXPIRED
        if (exp < String(Date.now())) {
          Alert.alert("Your session has expired");
          await logOut();
          setLoading(false);
          return;
        }

        //TOKEN ACTIVE
        setUser({
          username: usr,
          token: {
            value: tok,
            expiration: exp,
          },
          following: JSON.parse(following),
        });
        setIsLogged(true);
      }

      setLoading(false);
    }
    getToken();
  }, []);

  async function logIn(username: string, password: string) {
    try {
      const res = await fetch(`${SERVER}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await res.json();

      //response 200
      //update state and store the token in secure storage

      if (res.ok) {
        setLastError(undefined);
        setUser({
          username: data.user.username,
          token: data.token,
          following: data.user.following,
        });

        //store data to secure store
        await SecureStore.setItemAsync("token", data.token.value);
        await SecureStore.setItemAsync(
          "expiration",
          String(Date.now() + data.token.expiration * 1000)
        );
        await SecureStore.setItemAsync("user", data.user.username);
        await SecureStore.setItemAsync(
          "following",
          JSON.stringify(data.user.following)
        );

        setIsLogged(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setLastError(error as Error);
      throw error as Error;
    }
  }

  async function createAccount(username: string, password: string) {
    try {
      const res = await fetch(`${SERVER}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLastError(undefined);
        setUser({
          username: data.user.username,
          token: data.token,
          following: data.user.following,
        });

        //store data to secure store
        await SecureStore.setItemAsync("token", data.token.value);
        await SecureStore.setItemAsync(
          "expiration",
          String(Date.now() + data.token.expiration * 1000)
        );
        await SecureStore.setItemAsync("user", data.user.username);
        await SecureStore.setItemAsync(
          "following",
          JSON.stringify(data.user.following)
        );

        setIsLogged(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setLastError(error as Error);
      throw error as Error;
    }
  }

  async function logOut(socketRef: Socket | undefined = undefined) {
    try {
      //delete token from storage
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("expiration");
      await SecureStore.deleteItemAsync("following");
      //update logging state
      setUser(undefined);
      setIsLogged(false);
      if (socketRef) {
        socketRef.disconnect();
      }
    } catch (error) {
      setLastError(error as Error);
      throw error as Error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isLogged,
        logIn,
        createAccount,
        logOut,
        lastError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("Context is undefined");
  }

  return context;
};
