const express = require('express')
const auth = require('../../middleware/auth')
const router = express.Router()
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

// @access   Public
router.get('/api/auth', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    POST api/auth
// @des      Auth user & get token
// @access   Public
router.post('/api/auth', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password } = req.body
    
    try {
    // See if the user exist 
        let user = await User.findOne({ email })

        if(!user) {
            return res.status(400).json({ error : [{ msg: 'Invalid Credentials' }]})
        }
        // I used array in json send because I in validation sent an array in error

    // Match the user 
        const isMatched = await bcrypt.compare(password, user.password)

        if(!isMatched) {
            return res.status(400).json({ error : [{ msg: 'Invalid Credentials' }]})
        }

    // Return JWT
        const payload = {
            user: {
                id: user.id
            }
        }
        
        const jwtSecret = process.env.JWT_SECRET

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 360000 }, 
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;