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
    videoDate: String,
    postId: String,
    author: { name: String, email: String }
})

const Video = mongoose.model('Video', videoSchema)



export function sendVideo(videoUrl, videoDate, postId, author) {
    const video = new Video({
        videoUrl: videoUrl,
        videoDate: videoDate,
        postId: postId,
        author: author
    })

    video.save().then(result => {
        console.log('video saved!')
        mongoose.connection.close()
    })
}



//export default Video;


/*
@@@@@@@@@@@@@@@@@@@@

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2];
//const password = "twg2a1fI33KH1Flo";
const url = `mongodb+srv://tuvalroz:${password}@noamgiladtuvalcluster.qowf5fq.mongodb.net/videoApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);


const videoSchema = new mongoose.Schema({
    videoUrl: String,
    videoDate: String,
    postId: String,
    author: { name: String, email: String }
})

const Video = mongoose.model('Video', videoSchema)


const video = new Video({
    videoUrl: "fdslgjhdfjghdkfjgh",
    videoDate: "20.5.2023",
    postId: "2345345",
    author: { name: "asdasd", email: "asdas@asfdf" }
})

video.save().then(result => {
    console.log('video saved!')
    mongoose.connection.close()
})*/