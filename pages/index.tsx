import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import { getVideosUrl } from "../mongo/mongo";
import PageBar from "../components/PageBar";
import { useOnlineStatus } from "../components/useOnline";

const pageSize = 10;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let pageFromContext = parseInt(context.query?.page as string);
  let pageNumber = pageFromContext > 0 ? pageFromContext : 1;
  const feed = await prisma.post.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  const numberOfPosts: number = await prisma.post.count({
    where: {
      published: true,
    }
  });

  const urls = await getVideosUrl();

  return {
    props: { feed, urls, numberOfPosts, pageNumber }
  };
};

type Props = {
  feed: PostProps[];
  urls: Map<number, string>;
  numberOfPosts: number;
  pageNumber: number;
};

const Blog: React.FC<Props> = (props) => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  useOnlineStatus();
  const { feed, urls, numberOfPosts, pageNumber } = props;

  useEffect(() => {
    let newPosts = feed.map(post => {
      let newPost = { ...post };
      let url = urls.get(post.id);
      if (url) {
        newPost.videoUrl = url;
      }
      return newPost;
    });

    setPosts(newPosts);
  }, [props])

  return (
    <Layout>
      <PageBar
        currentPage={pageNumber}
        numberOfPosts={numberOfPosts}
        pageSize={pageSize}
      />
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {posts.map((post) => {
            return (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            )
          })}
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

export default Blog;
