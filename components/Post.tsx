import React, { useContext } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import darkModeContext from "./darkModeContext";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  const darkMode = useContext(darkModeContext).darkMode;

  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: ${darkMode ? "white" : "inherit"};
          padding: 2rem;
          ${darkMode ? "background-color: gray;" : ""}
        }
      `}</style>
    </div>
  );
};

export default Post;
