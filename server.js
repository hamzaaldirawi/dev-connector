const express = require('express')
const connectDB = require('./db/db')
const usersRouter = require('./routes/api/users')
const authRouter = require('./routes/api/auth')
const app = express()

// Connect DB
connectDB()

// init Middleware
app.use(express.json({extended: false}))
 
app.get('/', (req, res) => res.send('API Running'))

// Define Routes // in 2 different way
app.use(usersRouter)
app.use(authRouter)
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})