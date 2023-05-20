import { sendVideo } from "../../mongo/mongo";
import { IncomingForm } from 'formidable';

export default async (req, res) => {
    // get the data from the POST request
    console.log("start parse video, req =\n"+req)
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
    console.log("End Parse video")

    // get video properties
    const videoUrl = data?.files?.videoUrl;
    const videoDate = data?.files?.videoDate;
    const postId = data?.files?.postId;
    const author_name = data?.files?.author_name;
    const author_email = data?.files?.author_email;
    const author = { name: author_name, email: author_email };

    console.log("videoUrl:"+ videoUrl)
    console.log("videoDate:"+ videoDate)
    console.log("postId:"+ postId)
    console.log("author:"+ author)



    try {
        sendVideo(videoUrl, videoDate, postId, author);
        return res.json("Success");

    }
    catch (e) {
        return res.json("Fail");

    }


    /*
        // get the data from the POST request
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm();
    
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });
    
        // get file path
        const filePath = data?.files?.inputFile.filepath;
    
        // upload file to cloudinary
        const response = await cloudinary.v2.uploader.upload(filePath, {
            resource_type: 'video',
            public_id: 'my_video123123123',
        });
    
        // response == video url. now we will add it to the mongoDb and return the video id
        return res.json(response);
       */
};