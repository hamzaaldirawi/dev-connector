const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET
const auth = async (req, res, next) => {
    // Get token from the header
    const token = req.header('x-auth-token')

    // Check if no token
    if(!token) {
        return res.status(401).json({msg: 'No token, auth failed'})
    }

    // Verify Token
    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid'})
    }
}

module.exports = auth;