import { createContext, useContext, useState } from "react";
import { Post, User } from "../interfaces";
import { useCheckToken } from "../Hooks/useCheckToken";
import { SERVER } from "../config";
import { useAuth } from "./AuthContext";

interface PostsContextProps {
  posts: Post[];
  followingPosts: Post[];
  createPost: (title: string, description: string) => void;
  getPosts: () => void;
  getFollowingPosts: () => void;
  fetchNewPost: (id: string) => void;
  getUpdatedPostandReplaceOld: (id: string) => void;
  likePost: (id: string) => void;
  commentPost: (id: string, text: string) => void;
}

const PostsContext = createContext<PostsContextProps | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const isTokenOk = useCheckToken();

  async function createPost(title: string, description: string) {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch(`${SERVER}/posts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token.value}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        username: user.username,
      }),
    });

    const data = await res.json();
    console.log("From Create Post:", data);
  }

  async function getPosts() {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch(`${SERVER}/posts/getPosts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token.value}`,
      },
    });
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const data = await res.json();
    // console.log(data);
    setPosts([...data.posts]);
  }

  async function getFollowingPosts() {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch(`${SERVER}/posts/getFollowingPosts/${user.username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token.value}`,
      },
    });
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const data = await res.json();
    setFollowingPosts([...data.posts]);
  }

  async function fetchNewPost(id: string) {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    fetch(`${SERVER}/posts/getPostById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token.value}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("From Fetch New Post:", data);
        setPosts((prev) => [data.post, ...prev]);

        // Update followingPosts if the user is following the author of the post
        if (user.following.includes(data.post.username)) {
          setFollowingPosts((prev) => [data.post, ...prev]);
        }
      });
  }

  async function getUpdatedPostandReplaceOld(id: string) {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch(`${SERVER}/posts/getPostById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }

    const data = await res.json();
    // console.log("From Fetch Updated Post:", data);

    // Replace the post
    setPosts((prev) => prev.map((post) => (post.id === id ? data.post : post)));

    // Check if the username of the updated post is in the "following" array of the user
    if (user.following.includes(data.post.username)) {
      // Replace the post
      setFollowingPosts((prev) =>
        prev.map((post) => (post.id === id ? data.post : post))
      );
    }
  }

  async function likePost(id: string) {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    const res = await fetch(`${SERVER}/posts/likePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token.value}`,
      },
      body: JSON.stringify({
        username: user.username,
        postId: id,
      }),
    });
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const data = await res.json();
    console.log(data.message);
  }

  async function commentPost(id: string, text: string) {
    if (!user) throw new Error("User is not defined");

    //CHECK IF TOKEN IS STILL VALID
    const tokenOk = await isTokenOk();
    if (!tokenOk) return;

    // console.log("From Comment Post:", id, text, user.username);

    const res = await fetch(`${SERVER}/posts/commentPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token.value}`,
      },
      body: JSON.stringify({
        username: user.username,
        postId: id,
        commentText: text,
      }),
    });
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    const data = await res.json();
    console.log(data.message);
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        followingPosts,
        createPost,
        getPosts,
        getFollowingPosts,
        fetchNewPost,
        getUpdatedPostandReplaceOld,
        likePost,
        commentPost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

// Create a custom hook to use the context
export function usePostsActions() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsActions must be used within a PostsProvider");
  }
  return context;
}
