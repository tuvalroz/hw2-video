import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { sendVideo } from "../../../mongo/mongo";


// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, session, email, videoUrl } = req.body;

  const hasVideo = videoUrl ? true : false;

  if (session) {
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: email } },
        hasVideo: hasVideo
      },
    });

    if (hasVideo) {
      sendVideo(videoUrl, new Date(), result.id, result.authorId ?? -1)
    }

    res.json(result);
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
