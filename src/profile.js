//a presentational component showing our own profile
import React from "react";

import ProfilePic from "./profilePic";
import Bio from "./bio";


export default function Profile(props) {
    return (
        <div className="profile-container">
            <ProfilePic showUploader={props.showUploader} ProfilePicUrl = {props.ProfilePicUrl} />
            <div className="name-and-bio">
                <div className="name"> {props.first} {props.last} </div>
                <br/>
                <Bio bio={props.bio} setBio={props.setBio} />
            </div>
        </div>
    );
}
