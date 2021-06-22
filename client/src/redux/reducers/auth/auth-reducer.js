import authTypes from './auth-types';

const { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT,
    DELETE_ACCOUNT
} = authTypes

const token = localStorage.getItem('token')
const initialState = {
    token: token,
    isAuthenticated: null,
    loading: true,
    user: null
}

const auth = (state = initialState, action) => {
    const { type, payload } = action
    
    switch(type) {
        case USER_LOADED:
            return {
              ...state,
              isAuthenticated: true,
              loading: false,
              user: payload
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                token: payload,
                isAuthenticated: true,
                loading: false,
            };
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default: 
            return state
    }
}

export default auth;
