import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getPosts } from '../../redux/reducers/post/post-action'
import PostForm from './PostForm'
import PostItem from './PostItem'
import Spinner from '../layout/Spinner'


const Posts = ({ getPosts, post: {
    posts,
    loading
}}) => {

    useEffect(() => {
        getPosts()
    }, [getPosts])
    return (
        loading ? <Spinner /> : (
            <Fragment>
                <h1 className="large text-primary">Posts</h1>
                <p className="lead">
                    <i className="fas fa-user">
                        Welcome to the community
                    </i>
                </p>
                <PostForm />
                <div className="posts">
                    {posts.map(post => (
                        <PostItem key={post._id} post={post} />
                    ))}
                </div>
            </Fragment>
        )
    )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts)
