import { combineReducers } from 'redux';
import alert from './alert/alert-reducer';
import auth from './auth/auth-reducer';
import profile from './profile/profile-reducer';
import post from './post/post-reducer'

export default combineReducers({
    alert,
    auth,
    profile,
    post
});