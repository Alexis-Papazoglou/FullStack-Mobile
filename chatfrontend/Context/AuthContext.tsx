import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

interface AuthProps {
  isLogged: boolean;
  loading: boolean;
  logIn(username: string, password: string): Promise<any>;
  createAccount(username: string, password: string): Promise<any>;
  logOut(): Promise<any>;
  lastError: Error | undefined;
  user: User | undefined;
}

export interface User {
  username: string;
  token: Token;
}

export interface Token {
  value: string;
  expiration: string;
}

const SERVER = "http://192.168.1.19:3000";
const AuthContext = createContext<AuthProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();
  const [lastError, setLastError] = useState<Error | undefined>();

  //TODO : Handle Case token expired
  useEffect(() => {
    async function getToken() {
      setLoading(true);
      let tok = await SecureStore.getItemAsync("token");
      let exp = await SecureStore.getItemAsync("expiration");
      let usr = await SecureStore.getItemAsync("user");

      if (tok && usr && exp) {
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
        });

        //store data to secure store
        await SecureStore.setItemAsync("token", data.token.value);
        await SecureStore.setItemAsync(
          "expiration",
          String(Date.now() + data.token.expiration * 1000)
        );
        await SecureStore.setItemAsync("user", data.user.username);

        setIsLogged(true);
        //if response is not 200
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
        });

        //store data to secure store
        await SecureStore.setItemAsync("token", data.token.value);
        await SecureStore.setItemAsync(
          "expiration",
          String(Date.now() + data.token.expiration * 1000)
        );
        await SecureStore.setItemAsync("user", data.user.username);

        setIsLogged(true);
        //if response is not 200
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setLastError(error as Error);
      throw error as Error;
    }
  }

  async function logOut() {
    try {
      //delete token from storage
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("expiration");
      //update logging state
      setUser(undefined);
      setIsLogged(false);
    } catch (error) {
      setLastError(error as Error);
      throw error as Error;
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isLogged, logIn, createAccount, logOut, lastError }}
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