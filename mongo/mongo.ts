const mongoose = require('mongoose')

const password = "twg2a1fI33KH1Flo";
const url = `mongodb+srv://tuvalroz:${password}@noamgiladtuvalcluster.qowf5fq.mongodb.net/videoApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);


const videoSchema = new mongoose.Schema({
    videoUrl: String,
    videoDate: Date,
    postId: Number,
    authorId: Number
})
let Video: any = undefined; // Define Video model outside the function to prevent recompilation

try {
    Video = mongoose.model('Video'); // Try to retrieve an existing model
} catch {
    Video = mongoose.model('Video', videoSchema); // Create a new model if it doesn't exist
}

export function sendVideo(videoUrl: string, videoDate: Date, postId: number, authorId: number) {
    const video = new Video({
        videoUrl: videoUrl,
        videoDate: videoDate,
        postId: postId,
        authorId: authorId
    })

    video.save().then((_result: any) => {
        console.log('video saved!')
    })
}

export async function getVideosUrl(): Promise<Map<number, string>> {
    let urls = await Video.find({}).then((result: any) => {
        let urlsMap = new Map<number, string>();

        result.forEach((video: any) => {
            urlsMap.set(video.postId, video.videoUrl)

        });

        return urlsMap;


    })
    return urls;
}