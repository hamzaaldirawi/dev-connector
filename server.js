const express = require('express')
const connectDB = require('./db/db')
const usersRouter = require('./routes/api/users')
const authRouter = require('./routes/api/auth')
const app = express()
const path = require('path')
// Connect DB
connectDB()

// init Middleware
app.use(express.json({extended: false}))

// For Development only
if(process.env.NODE_ENV === 'development') {
    app.get('/', (req, res) => res.json())
}


// Define Routes // in 2 different way
app.use(usersRouter)
app.use(authRouter)
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})