//a component showing friends button which can show different messages depending on the existing relationship between users

import React from "react";
import axios from "./axios";
import {initSocket} from "./socket.js";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rejectButtonVisible: false
        };

        this.reaction = this.reaction.bind(this);
        this.reject = this.reject.bind(this);
    }

    //when the page of other user loads we evaluate which relationship the main user has with them and adjust the button text accordingly
    //status in the state determines which action happens on the button click
    async componentDidMount() {
        try {
            let resp = await axios.get("/friendship/" + this.props.otherUserId);

            if (resp.data == "") {
                this.setState({
                    text: "Send a friend request",
                    status: 0
                });
            }

            if (!resp.data.accepted && resp.data.receiver_id == this.props.otherUserId) {
                this.setState({
                    text: "Cancel the request",
                    status: 1
                });
            }

            if (!resp.data.accepted && resp.data.sender_id == this.props.otherUserId) {
                this.setState({
                    text: "Accept the request",
                    status: 2,
                    rejectButtonVisible: true
                });
            }

            if (resp.data.accepted) {
                this.setState({
                    text: "unfriend",
                    status: 3
                });
            }

        } catch (err) {
            console.log("error in mounting friend button", err);
        }

    }

    async reaction() {
        let socket = initSocket();

        try {
            if (this.state.status == 0) {
                await axios.post("/friendship/" + this.props.otherUserId + "/send");
                this.setState({
                    status: 1,
                    text: "Cancel the request"
                });
                //sending a socket back with info about who im adding. this person should receive a notification
                socket.emit("friendRequestMade", this.props.otherUserId);
                return;
            }

            if (this.state.status==1 || this.state.status==3) {
                await axios.post("/friendship/" + this.props.otherUserId + "/delete");
                this.setState({
                    status: 0,
                    text: "Send a friend request"
                });
            }

            if (this.state.status==2) {
                await axios.post("/friendship/" + this.props.otherUserId + "/accept");
                this.setState({
                    status: 3,
                    text: "unfriend",
                    rejectButtonVisible: false
                });
                return;
            }
        } catch (err) {
            console.log("error in clicking button", err);
        }

    }

    async reject() {
        await axios.post("/friendship/" + this.props.otherUserId + "/delete");
        this.setState({
            status: 0,
            text: "Send a friend request",
            rejectButtonVisible: false
        });
        return;
    }


    render() {
        return(
            <div className="friend-button-container">
                <button onClick={this.reaction}> {this.state.text} </button>
                <br/><br/>
                {this.state.rejectButtonVisible &&
                <button onClick={this.reject}> reject </button>}
            </div>
        );
    }
}
