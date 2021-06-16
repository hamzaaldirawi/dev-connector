import authTypes from './auth-types';

const { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, TOKEN_LOADED } = authTypes

const initialState = {
    token: null,
    isAuthenticated: null,
    loading: true,
    user: null
}

const auth = (state = initialState, action) => {
    const { type, payload } = action
    
    switch(type) {
        case TOKEN_LOADED:
            return {
                ...state,
                token: payload
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                token: payload.token,
                isAuthenticated: true,
                loading: false
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: payload.token,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            }
        default: 
            return state
    }
}

export default auth;
