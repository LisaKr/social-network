//frontpage with 3d buttons

import React from "react";
import { Link } from 'react-router-dom';
import Logo from "./logo";

export default function Frontpage() {
    return (
        <div>
            <div className="welcome-logo"><Logo/></div>

            <div className ="buttons">
                <div className="scene">
                    <div className="cube">
                        <Link to = "/login" className="front"> LOG IN </Link>
                        <Link to = "/login" className="bottom"> we missed you! </Link>
                    </div>
                </div>

                <div className="scene">
                    <div className="cube">
                        <Link to = "/registration" className="front"> SIGN UP </Link>
                        <Link to = "/registration" className="bottom"> ...it goes really quick! </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
