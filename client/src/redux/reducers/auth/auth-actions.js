import axios from 'axios';
import { setAlert } from '../alert/alert-actions';
import authTypes from './auth-types';
import setAuthToken from '../../../utils/setAuthToken';
import makeAuthTokenHeader from '../../../utils/makeAuthHeader';

const { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL,TOKEN_LOADED } = authTypes;


// load Token
export const loadToken = () => async dispatch => {
    if (localStorage.token) {
      return dispatch({
        type: TOKEN_LOADED,
        payload: localStorage.getItem('token')
      })
    } else {
      dispatch({
        type: AUTH_ERROR
      })
    }
}
// Load User 
export const loadUser = () => async dispatch => {

    try {
        const header = makeAuthTokenHeader(localStorage.getItem('token'))

        const res = axios.get('/api/auth', header)
        
        console.log(res)

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })

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
            
            localStorage.removeItem('token')

            dispatch({
                type: REGISTER_FAIL
            })
        

    }
}

// Login User 
export const login = ({ email, password }) => async dispatch => {
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
                type: LOGIN_FAIL,
            })
        

    }
}
