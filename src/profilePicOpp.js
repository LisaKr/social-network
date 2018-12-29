//a presentational component showing profile pic for other person's profile
import React from "react";

export default function ProfilePicOpp(props) {
    return (
        <div className="profile-pic-container">
            <div className="profile-and-button">
                <img className="profile" src={props.ProfilePicUrl}/>
            </div>
        </div>
    );
}
