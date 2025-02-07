import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import { useSession, getSession } from "next-auth/react";
import prisma from '../lib/prisma'
import { getVideosUrl } from "../mongo/mongo";


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user?.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },

  });
  const urls = await getVideosUrl();

  return {
    props: { drafts, urls },
  };
};

type Props = {
  drafts: PostProps[];
  urls: Map<number, string>;

};

const Drafts: React.FC<Props> = (props) => {
  const [draftsFeed, setDraftsFeed] = useState<PostProps[]>([]);
  const { data: session } = useSession();
  const { drafts, urls } = props;

  useEffect(() => {
    let newDrafts = drafts.map(draft => {
      let newDraft = { ...draft };
      let url = urls.get(draft.id);
      if (url) {
        newDraft.videoUrl = url;
      }
      return newDraft;
    });

    setDraftsFeed(newDrafts);
  }, [props])

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {draftsFeed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;
