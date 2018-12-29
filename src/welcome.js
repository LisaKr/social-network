//the logged out experience
import React from "react";
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';
import Frontpage from './frontpage';
//hash routing originally: serving static websites, changing website without request for the server

export default function Welcome() {
    return (
        <div className="page">
            <div className="welcome-container">
                <HashRouter>
                    <div>
                        <Route exact path = "/" component = {Frontpage} />
                        <Route path = "/registration" component = {Registration} />
                        <Route path = "/login" component = {Login} />
                    </div>
                </HashRouter>
            </div>
        </div>
    );
}
