import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import { getVideosUrl } from "../mongo/mongo";

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
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

  const urls = await getVideosUrl();

  return {
    props: { feed, urls }
  };
};

type Props = {
  feed: PostProps[];
  urls: Map<number, string>;
};

const Blog: React.FC<Props> = (props) => {
  console.log("size of urls is " + props.urls.size)



  props.feed.forEach(post => {
    let url = props.urls.get(post.id);
    if (url) {
      post.videoUrl = url;
    }
  });


  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => {
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
