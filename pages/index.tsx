import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import { getVideoUrl } from "../mongo/mongo";

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

  /*let feedWithVideo = await feed.map(async (post) => {
    if (post.hasVideo) {
      const url = await getVideoUrl(post.id);
      (post as PostProps).videoUrl = url;
    }

    return post;
  });*/

  let urlsMap = new Map<string, string>();




  feed.forEach(async (post) => {
    if (post.hasVideo) {
      console.log("Before getVideoUrl");
      const url = await getVideoUrl(post.id);
      urlsMap.set(post.id.toString(), url);
      console.log("After getVideoUrl222222 "+urlsMap.get(post.id.toString()));
      console.log("sizeeee "+ urlsMap.size)
    }
  });

  


  //for each post get its video

  return {
    props: { feed, urlsMap },
  };
};

type Props = {
  feed: PostProps[];
  urlsMap: Map<string, string>;
};

const Blog: React.FC<Props> = (props) => {
  console.log("size of map is "+ props.urlsMap.size)

 

  props.feed.forEach(post => {
    let url = props.urlsMap.get(post.id.toString());
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
