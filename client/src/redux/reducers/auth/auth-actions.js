import axios from 'axios';
import { setAlert } from '../alert/alert-actions';
import authTypes from './auth-types';
import profileTypes from '../profile/profile-types'; // FOR CLEAN PROFILE IN LOGOUT
import setAuthToken from '../../../utils/setAuthToken';

const { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, DELETE_ACCOUNT } = authTypes;

const { CLEAR_PROFILE, PROFILE_ERROR } = profileTypes

// Load User 
export const loadUser = () => async dispatch => {
    if(localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('/api/auth')
        
        dispatch({
            type: USER_LOADED,
            payload: res.data
          });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

// Register User 
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password })


    try {
        const res = await axios.post('/api/users', body, config)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    } catch(err) {
        
        const errors = err.response.data.errors

        const error = err.response.data.error

            if (errors) {
                errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
            }

            if (error) {
                error.forEach(err => dispatch(setAlert(err.msg, 'danger')))
            }
        
            dispatch({
                type: REGISTER_FAIL
            })
        

    }
}

// Login User 
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password })

    try {
        const res = await axios.post('/api/auth', body, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    } catch(err) {
        
        const errors = err.response.data.errors

        const error = err.response.data.error

            if (errors) {
                errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
            }

            if (error) {
                error.forEach(err => dispatch(setAlert(err.msg, 'danger')))
            }
        
            dispatch({
                type: LOGIN_FAIL
            })
        

    }
}


// LOGOUT / CLEAR PROFILE
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    dispatch({ type: LOGOUT })
}

// DELETE ACCOUNT & PROFILE 
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone!')) {

        try {
           await axios.delete(`/api/profile`)
    
            dispatch({
                type: CLEAR_PROFILE,
            })

            dispatch({
                type: DELETE_ACCOUNT,
            })
    
            dispatch(setAlert('Account Deleted'))
    
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            }) 
        }

    }

}