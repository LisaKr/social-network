import * as io from 'socket.io-client';
import { onlineUsers, userJoined, userLeft, showLastMessages, addMessage, friendRequest } from "./actions.js";


let socket;

export function initSocket(store) {
    //we want each logged in user to have only one open socket
    //when we refresh, the socet disconnects and then reconnects
    if (!socket) {
        socket = io.connect();
        //the moment the user logs in or register we initiate the socket
        //callback runs when the client listens to the event
        socket.on("onlineUsers", (listOfUsers) => {
            store.dispatch(onlineUsers(listOfUsers));
        });

        //userWhoJoined is an array with one object inside
        socket.on("userJoined", (userWhoJoined) => {
            store.dispatch(userJoined(userWhoJoined));
        });

        socket.on("userLeft", (userWhoLeft) => {
            store.dispatch(userLeft(userWhoLeft));
        });

        socket.on("showLastMessages", (messages) => {
            store.dispatch(showLastMessages(messages));
        });

        socket.on("addMessage", (newMessage) => {
            store.dispatch(addMessage(newMessage));
        });

        socket.on("friendRequest", (sendingUser) => {
            store.dispatch(friendRequest(sendingUser));
        });

    }
    return socket;
}
