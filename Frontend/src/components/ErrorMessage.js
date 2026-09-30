import React from "react";
import { Alert } from "react-bootstrap";

function ErrorMessage({ message }) {

    if (!message) {
        return null;
    }

    return (
        <Alert variant="danger">
            {message}
        </Alert>
    );
}

export default ErrorMessage;