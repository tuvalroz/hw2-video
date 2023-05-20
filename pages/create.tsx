import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { Upload } from "../components/Upload";
import { PostProps } from "../components/Post";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFileFormData, setSelectedFileFormData] = useState<FormData>(new FormData());
  const { data: session, status } = useSession();
  let email = session?.user?.email;
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let videoId = "";
    let videoData = undefined;

    if (selectedFileFormData.get('inputFile')) {
      videoData = await postVideoInColudinary(selectedFileFormData);
    }

    try {
      const body = { title, content, session, email, videoUrl: videoId }; // need to check in the backend if the videoId is empty
      let response = await fetch(`/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
      let publishedPost = await response.json();

      postVideoInMongo(videoData, publishedPost); //TODO continue from here (implement this)

    } catch (error) {
      console.error(error);
    }
  };

  const postVideoInMongo = async (videoData: { url: string, created_at: string, asset_id: string }, post: PostProps) => {

    let videoFormData = new FormData();
    videoFormData.append('videoUrl', videoData.url);
    videoFormData.append('videoDate', videoData.created_at);
    videoFormData.append('postId', post.id.toString());
    videoFormData.append('author_name', post.author?.name ?? "");
    videoFormData.append('author_email', post.author?.email ?? "");

    try {
      const response = await fetch('/api/postVideoMongo', {
        method: 'POST',
        body: videoFormData,
      });
      const res = await response;
      console.log(res);
      const data = await res.json();

      return data;

    } catch (error) {
      console.log(error);
    }







    return "1";
  }

  const postVideoInColudinary = async (formData: FormData) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const res = await response;
      console.log(res);
      const data = await res.json();

      return data;

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <Upload setFormData={setSelectedFileFormData} />
          <br />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
