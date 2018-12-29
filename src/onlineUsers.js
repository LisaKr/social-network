//component all users who are currently online
import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';


class onlineUsers extends React.Component {
    constructor() {
        super();
    }


    render() {
        return (
            <div className="onlineUsers-container">
                <div className="title"><h2>Users online</h2></div>
                {this.props.users && this.props.users.map(
                    u => {
                        return (
                            <Link to={`/user/${u.id}`} key={u.id} className="no-underline">
                                <div  className="users">
                                    <div className="online-pic">
                                        <img className="profile" src={u.imgurl || "/1.jpg"} />
                                    </div>
                                    <div className="online-name">{u.first} {u.last}</div>
                                </div>
                            </Link>
                        );
                    }
                )}
            </div>
        );

    }
}


function mapStateToProps(state) {
    return {
        users: state.onlineUsers
    };
}

export default connect(mapStateToProps)(onlineUsers);
