import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';

cloudinary.config({
    cloud_name: "dxvbzha28",
    api_key: "842373291265491",
    api_secret: "1ZDpDCJnX-aiIU_a1DL1BdBq2e0"
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
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
        public_id: 'my_video',
    });

    // response == video url. now we will add it to the mongoDb and return the video id
    return res.json(response);
};