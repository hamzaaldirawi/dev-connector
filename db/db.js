const mongoose = require('mongoose')
//const config = require('config')
//const db = config.get('mongoURI')
const URL = process.env.MONGODB_URL

const connectDB = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log("MongoDB connected")
    } catch(err) {
        console.log(err.message)
        // exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB