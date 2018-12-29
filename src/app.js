import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";


import Logo from "./logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./otherPersonProfile";
import Friends from "./friends";
import OnlineUsers from "./onlineUsers";
import Chat from "./chat";
import Search from "./search";
import FriendRequest from "./friendRequest";


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };

        this.showUploader = this.showUploader.bind(this);
        this.changePic = this.changePic.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    //getting info about the logged in user every time the main component re-mounts (on reload)
    async componentDidMount() {
        try {
            const resp = await axios.get("/user/info");

            if (resp.data.ProfilePicUrl) {
                this.setState(resp.data);
            } else {
                resp.data.ProfilePicUrl = "/1.jpg";
                this.setState(resp.data);
            }
        } catch (err) {
            console.log("ERROR IN GETTING USER", err);
        }
    }

    //these functions are being passed as props to children, get triggered there, so that the parent knows when to execute them
    //children signal parent to change its state which is ultimately rendered
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    changePic(url) {
        this.setState({
            ProfilePicUrl: url,
            uploaderIsVisible: false
        });
    }

    hideUploader(){
        this.setState({
            uploaderIsVisible: false
        });
    }

    setBio(bio) {
        this.setState({
            bio: bio
        });
    }

    render() {
        return(
            <div className="app-page">
                {/*ROUTE FOR OUR OWN PROFILE AND ITS RENDERING*/}
                <BrowserRouter>
                    <div>
                        {/*AN ALWAYS PRESENT HEADER CONTAINING LOGO, SEARCH, A SMALL PROFILE PIC AND ICONS FOR ALL THE FUNCTIONS*/}
                        <div className="app-header">
                            <div className="header-left">
                                <ProfilePic
                                    ProfilePicUrl = {this.state.ProfilePicUrl}
                                    showUploader = {this.showUploader}
                                />
                                <div className="search"> <Search/> </div>
                            </div>

                            <Link to="/"><div className="app-logo"> <Logo/> </div></Link>

                            <div className="header-right">
                                <Link to="/chat"> <img className="icon chat" src="/chat.png"/> </Link>
                                <Link to="/online"> <img className="icon online" src="/online.png"/> </Link>
                                <Link to="/friends"> <img className="icon friend" src="/friends.png"/> </Link>
                                <a href="/logout"> <img className="icon" src="/logout.png"/> </a>
                            </div>
                        </div>

                        <Route
                            //Normal React state, passing props to component
                            exact path="/"
                            render={() => {
                                return (
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        ProfilePicUrl={this.state.ProfilePicUrl}
                                        bio={this.state.bio}
                                        setBio={this.setBio}
                                        showUploader={this.showUploader}
                                    />
                                );
                            }}
                        />

                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherPersonProfile {...props} key={props.match.url} />
                            )}
                        />

                        <Route
                            path="/friends"
                            component={Friends}
                        />

                        <Route
                            path="/online"
                            component={OnlineUsers}
                        />

                        <Route
                            path="/chat"
                            component={Chat}
                        />
                        {/*Redux: notification about incoming friend request, no matter where on the site you are*/}
                        {this.props.friendRequest && <FriendRequest/>}
                    </div>
                </BrowserRouter>

                {/*Normal React state, passing props to component: Profile pic uploader, no matter where on the site you are*/}
                {this.state.uploaderIsVisible && <Uploader
                    userID = {this.state.userID}
                    changePic = {this.changePic}
                    hideUploader = {this.hideUploader}
                />}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        friendRequest: state.friendRequest
    };
}

export default connect(mapStateToProps)(App);
