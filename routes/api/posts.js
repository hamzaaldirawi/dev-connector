const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const Post = require('../../models/Post')
const auth = require('../../middleware/auth')

// @route    Post api/posts
// @des      Create Post
// @access   Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save()

        res.json(post)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    Get api/posts
// @des      get all Posts
// @access   Private or Public
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1})
        res.json(posts)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    Get api/posts/:post_id
// @des      get Post by Id
// @access   Private or Public
router.get('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        
        if(!post) {
            return res.status(404).json({ msg: 'No Post Found' })
        }

        res.json(post)
    } catch (err) {
        console.error(err.message)
        if(err.Kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No Post Found' })
        }
        res.status(500).send('Server Error')
    }
})

// @route    Delete api/posts/:post_id
// @des      delete Post by Id
// @access   Private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)
        
        if(!post) {
            return res.status(404).send({ msg: 'Post Not Found '})
        }
        
        // Check user 
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User Not Auth '})
        }

        await post.remove()

        res.json({ msg: 'Post Removed' })
    } catch (err) {
        console.error(err.message)
        if(err.Kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No Post Found' })
        }
        res.status(500).send('Server Error')
    }
})

// @route    Put api/posts/like/:post_id
// @des      like Post
// @access   Private
router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)

        // Check if post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked'})
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    Put api/posts/unlike/:post_id
// @des      like Post
// @access   Private
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)

        // Check if post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not been liked'})
        }

        // Get remove index 
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        // remove like
        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)
        
    } catch (err) {
        console.error(err.message)
        console.log(err.kind)
        if(err.Kind == 'ObjectId') {
            return res.status(404).json({ msg: 'No Post Found' })
        }
        res.status(500).send('Server Error')
    }
})

//////

// @route    Put api/posts/comment/:post_id
// @des      comment on Post
// @access   Private
router.put('/comment/:post_id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.post_id)


        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment)
 
        await post.save()

        res.json(post.comments)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    delete api/posts/comment/:post_id/:comment_id
// @des      remove Comment
// @access   Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)

        
        if(post === null) {
            return res.status(404).json({ msg: 'No post found'})
        }

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        // make sure comment exist
        if(!comment) {
            return res.status(404).json({ msg: 'No comment found'})
        }

        // Check User
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not auth'})
        }

        // Get remove index 
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

        // remove comment
        post.comments.splice(removeIndex, 1)

        await post.save()

        res.json(post.comments)
        
    } catch (err) {
        console.error(err.message)
        if(err.Kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No Post Found' })
        }
        res.status(500).send('Server Error')
    }
})


module.exports = router;