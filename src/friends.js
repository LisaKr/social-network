//component showing our friends and friend requests

import React from "react";
import { getFriends, unfriend, accept } from './actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


class Friends extends React.Component {
    constructor() {
        super();
    }

    async componentDidMount() {
        this.props.dispatch(getFriends());
    }

    render() {
        if (!this.props.friends && !this.props.wannabes) {
            return null;
        }
        return (
            <div>
                <div className="title"><h2>Your friends</h2></div>
                <div className="friends-container">
                    {this.props.friends && this.props.friends.map(
                        f => {
                            return (
                                <div key={f.id} className="friends">
                                    <Link to={`/user/${f.id}`} className="no-underline">
                                        <div className="friend-pic">
                                            f.imgurl && <img className="profile" src={f.imgurl || "/1.jpg"} />
                                        </div>
                                        <div className="friend-name">{f.first} {f.last}</div>
                                        <div className="relationship-button-friendpage"><button onClick={ () => {this.props.dispatch(unfriend(f.id));}}> Unfriend </button></div>
                                    </Link>
                                </div>
                            );
                        }
                    )}
                </div>
                <div className="title"><h2>Friend requests</h2></div>
                <div className="friends-container">
                    {this.props.wannabes && this.props.wannabes.map(
                        w => {
                            return (
                                <div key={w.id} className="friends">
                                    <div className="friend-pic">
                                        <img className="profile" src={w.imgurl || "/1.jpg"} />
                                    </div>
                                    <div className="friend-name">{w.first} {w.last}</div>
                                    <div className="relationship-button-friendpage">
                                        <button onClick={() => {this.props.dispatch(accept(w.id));}}> Accept </button>
                                        <button onClick={() => {this.props.dispatch(unfriend(w.id));}}> Reject </button>                                        </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        );
    }
}


//pulling both friends and friend requests from the state and separating them before passing them as props to the components
function mapStateToProps(state) {
    var list = state.friendsWannabes;

    return {
        friends: list && list.filter(
            user => user.accepted == true
        ),
        wannabes: list && list.filter(
            user => !user.accepted
        )
    };
}

export default connect(mapStateToProps)(Friends);
