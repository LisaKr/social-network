import React from "react";

//the passed methods and properties from props are not a local copy, they directly reference the state
//they are passed from
//so when we click on the picture, showuploader runs in the parent element and takes effect there

export default function ProfilePic(props) {
    return (
        <div className="profile-pic-container">
            <div className="profile-and-button">
                <img className="profile" src={props.ProfilePicUrl}/>
                <div onClick= {props.showUploader} className="uploaderButton">
                    <div className="uploader-text">
                        <img className="camera" src="/camera.png"/>
                            Update your pic!
                    </div>
                </div>
            </div>
        </div>
    );
}
