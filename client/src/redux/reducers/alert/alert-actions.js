import alertTypes from './alert-types';
import { v4 as uuidv4 } from 'uuid';

const { 
    SET_ALERT,
    REMOVE_ALERT 
} = alertTypes;

export const setAlert = (msg, alertType) => dispatch => {
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: {
            msg,
            alertType,
            id
        }
    })

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 5000)
}