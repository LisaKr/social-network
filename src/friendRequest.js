//component that is being rendered as notification when a friend request is being made

import React from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

// import {closeFriendRequest} from "./actions.js";



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
                            <Link to={`/user/${f.id}`}
                                className="no-underline">
                                {this.props.friendRequest.length}
                            </Link>
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
