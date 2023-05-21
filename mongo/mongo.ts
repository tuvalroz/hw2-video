const mongoose = require('mongoose')

/*if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}*/

//const password = process.argv[2]; TODO not pass the password like this
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
        //mongoose.connection.close() //TODO check if need this close?
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