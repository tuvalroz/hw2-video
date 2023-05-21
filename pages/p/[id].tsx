import React, { useContext } from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import prisma from '../../lib/prisma'
import { useSession } from "next-auth/react";
import darkModeContext from "../../components/darkModeContext";
import { getVideosUrl } from "../../mongo/mongo";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  const urls = await getVideosUrl();

  return {
    props: { post, urls } ?? { author: { name: "Me" } }
  };
};

async function publishPost(id: number): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/")
}

async function deletePost(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  await Router.push("/")
}

type Props = {
  post: PostProps;
  urls: Map<number, string>;
};


const Post: React.FC<Props> = (props) => {
  const darkMode = useContext(darkModeContext).darkMode;
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.post.author?.email;
  let title = props.post.title;
  if (!props.post.published) {
    title = `${title} (Draft)`;
  }

  let url = props.urls.get(props.post.id);
  props.post.videoUrl = url;

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.post.author?.name || "Unknown author"}</p>
        <p><ReactMarkdown children={props.post.content} /></p>
        {props.post.videoUrl &&
          <div> <video src={props.post.videoUrl} autoPlay={true} loop={true} />  <br /> </div>}
        {!props.post.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.post.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.post.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }
        h2 {
          ${darkMode ? "color: white" : ""};
        }
        p {
          ${darkMode ? "color: white" : ""};
        }

        button {
          background: ${darkMode ? "gray" : "#ececec"};
          ${darkMode ? "color: white" : ""};
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
