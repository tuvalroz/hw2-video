import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { Upload } from "../components/Upload";
import darkModeContext from "../components/darkModeContext";

const Draft: React.FC = () => {
  const darkMode = useContext(darkModeContext).darkMode;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFileFormData, setSelectedFileFormData] = useState<FormData>(new FormData());
  const { data: session, status } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  let email = session?.user?.email;

  const submitData = async (e: React.SyntheticEvent) => {
    setIsUploading(true);
    e.preventDefault();
    let videoUrl = undefined;

    if (selectedFileFormData.get('inputFile')) {
      let videoData = await postVideoInColudinary(selectedFileFormData);
      videoUrl = videoData.url;
    }

    try {
      const body = { title, content, session, email, videoUrl }; // need to check in the backend if the videoId is empty
      let response = await fetch(`/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
      await response.json();

      setIsUploading(false);

    } catch (error) {
      console.error(error);
      setIsUploading(false);

    }
  };

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
          {!isUploading ?
            <input disabled={!content || !title} type="submit" value="Create" />
            :
            <div className="spinner-container">
              <div className="loading-spinner">
              </div>
            </div>
          }

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


        a{
          ${darkMode ? "color: white" : ""}
        }
        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loading-spinner{
          width: 50px;
          height: 50px;
          border: 10px solid #f3f3f3; /* Light grey */
          border-top: 10px solid #383636; /* Black */
          border-radius: 50%;
          animation: spinner 1.5s linear infinite;

        }
      `}</style>
    </Layout>
  );
};

export default Draft;
