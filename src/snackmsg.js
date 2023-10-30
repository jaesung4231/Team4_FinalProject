import React from 'react';

import {Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
} 

const SnackbarMsg = (props) => {
    return (
        <Snackbar open={props.open} autoHideDuration={3000} onClose={props.onClose} message={props.message}>
            <Alert onClose={props.onClose} severity="success">{props.message}</Alert>
        </Snackbar>
    );
}

export default SnackbarMsg;