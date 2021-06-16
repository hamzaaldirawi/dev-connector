const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const User = require('../../models/User')

// @route    POST api/users
// @des      Register user
// @access   Public
router.post('/api/users', [
    check('name', `Name is required`)
    .not().isEmpty(),
    check('email', 'Please include a vaild email').isEmail(),
    check('password', 'Please Enter a password with 6 or more').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { name, email, password } = req.body
    
    try {
    // See if the user exist 
        let user = await User.findOne({ email })

        if(user) {
            return res.status(400).json({ error : [{ msg: 'User Already exist' }]})
        }
        // I used array in json send because I in validation sent an array in error

    // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

    // Encrypt password
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()

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