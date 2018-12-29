import React from "react";
import { connect } from "react-redux";
import {initSocket} from "./socket.js";

class Chat extends React.Component {
    constructor(props) {
        super(props);
    }


    sendMessage(e){
        let socket = initSocket();
        if (e.which==13) {
            socket.emit("chatMessage", e.target.value);
            e.preventDefault();
            e.target.value = "";
        }
    }

    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render() {
        return(
            <div className="chat-container">
                <h1>Join the chatroom!</h1>
                <div className="chat-messages" ref={elem => (this.elem = elem)}>
                    {this.props.messages && this.props.messages.map(
                        m => {
                            return (
                                <div key={m.m_id} className="messages">
                                    <br/><br/>
                                    {m.created_at} <br/>
                                    { m.imgurl && <img className="profile" src={m.imgurl} />}
                                    { !m.imgurl && <img className="profile" src = "/1.jpg" />}
                                    {m.first} {m.last}
                                    <br/>
                                    {m.message}
                                </div>
                            );
                        }
                    )}
                </div>
                <div className="chat-textarea">
                    <h3> Add a message </h3>
                    <textarea onKeyDown={this.sendMessage}/>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {

    return {
        messages: state.messages
    };
}



export default connect(mapStateToProps)(Chat);

//chat component is the first one to know about the new message (after hitting enter). then it needs to communicate it
//to the server

//emitting the e.target.value back to the server

//chat is emitting the message to the server using sockets. server needs to listen fot it.
//server stores it -- create a new table OR in an array of objects (message, first, last, pic, id) in index.js (before on connection, push it into the array)
//then we need to take information about it and put it in the global state
//server sends this information and sends it back to the front where we actually put it into state (to socket.js)

//on connection we are gonna build an array of ten most recent chat messages we want to emit it to the client and chat component will connect to it
