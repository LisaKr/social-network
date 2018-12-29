//component that is being rendered as notification when a friend request is being made

import React from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import {closeFriendRequest} from "./actions.js";



class FriendRequest extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            this.props.friendRequest.map(
                f => {
                    return (
                        <div className="friend-request-container" key={f.id}>
                            <div
                                className="closingbutton"
                                onClick={() =>
                                    this.props.dispatch(closeFriendRequest())}>
                            X
                            </div>

                            <div className="friend-request-name">
                                <h3>Attention!</h3>
                                <img className=" profile friend-request-image" src={f.imgurl || "/1.jpg"}/>
                                <br/><br/>
                                User {f.first} {f.last} wants to be your friend! <br/><br/>

                                <Link to={`/user/${f.id}`} onClick={() =>
                                    this.props.dispatch(closeFriendRequest())}
                                className="no-underline">
                                    Click here to accept or reject
                                </Link>

                            </div>
                        </div>
                    );
                }
            )
        );
    }
}

function mapStateToProps(state) {

    return {
        friendRequest: state.friendRequest
    };
}

export default connect(mapStateToProps)(FriendRequest);
