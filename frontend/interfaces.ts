export interface User {
  username: string;
  token: Token;
  following: string[];
}

export interface Token {
  value: string;
  expiration: string;
}

export interface Comment {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  username: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
}
