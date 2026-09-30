import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, role, ...rest }) {

    return (
        <Route
            {...rest}
            render={props => {
                const token = localStorage.getItem("token");
                const userRole = localStorage.getItem("role");

                if (!token) {
                    return <Redirect to="/" />;
                }

                const allowedRoles = Array.isArray(role) ? role : [role];

                if (role && !allowedRoles.includes(userRole)) {
                    return <Redirect to="/" />;
                }

                return <Component {...props} />;
            }}
        />
    );
}

export default PrivateRoute;