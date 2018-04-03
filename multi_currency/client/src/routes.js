import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home/HomeComponent';
import Login from './components/Login/LoginComponent';
import Logout from './components/Login/LogoutComponent';
import Register from './components/Register/RegisterComponent';

const Auth = {
    isAuthenticated: false,
    token: null,

    headers(token = null) {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    },

    authenticate(data, cb) {
        fetch('/users/login', {
            method: 'post',
            headers: this.headers(),
            body: JSON.stringify(data),
        }).then(res => res.json()).then(res => {
            if (res.data === null) {
                alert(res.error.msg);
                return;
            }
            this.token = res.data.token;
            console.log(this.token);
            this.isAuthenticated = true;
            cb();
        });
    },
    signout(cb) {
        this.token = null;
        this.isAuthenticated = false;
        cb();
    }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            Auth.isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={Register} />
        </Switch>
    </BrowserRouter>
);

export { Routes, Auth };