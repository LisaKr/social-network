import axios from './axios';

//getting all friends and friends requests for "friends" page
export async function getFriends() {
    const resp = await axios.get('/get-friends');
    return {
        type: 'GET_FRIENDS',
        friendsWannabes: resp.data
    };
}

//friend button actions
export async function unfriend(id) {
    await axios.post("/friendship/" + id + "/delete");
    return {
        type: "DELETE_FRIEND",
        deletedFriend: id
    };
}

export async function accept(id) {
    await axios.post("/friendship/" + id + "/accept");
    return {
        type: "ACCEPT_FRIEND",
        addedFriend: id
    };
}

//showing online users
export async function onlineUsers(listOfUsers) {
    return {
        type: "ONLINE_USERS",
        onlineUsers: listOfUsers
    };
}

//for displaying online users
export async function userJoined(userWhoJoined) {
    return {
        type: "USER_JOINED",
        userWhoJoined: userWhoJoined
    };
}

export async function userLeft(userWhoLeft) {
    return {
        type: "USER_LEFT",
        userWhoLeft: userWhoLeft
    };
}

//for displaying chat
export async function showLastMessages(messages) {
    return {
        type: "SHOW_MESSAGES",
        messages: messages
    };
}

export async function addMessage(newMessage) {
    return {
        type: "ADD_MESSAGE",
        newMessage: newMessage
    };
}

//bonus feature: incremental search
export async function getSearchResults(request) {

    if (request == "") {
        return {
            type: "GET_SEARCH_RESULTS",
            searchResults: null
        };
    }

    let resp = await axios.get("/search/" + request);

    if (resp.data == "") {
        resp.data = [{error: "No results found"}];
    }

    return {
        type: "GET_SEARCH_RESULTS",
        //array of objects
        searchResults: resp.data
    };
}

export async function hideResults() {
    return {
        type: "GET_SEARCH_RESULTS",
        searchResults: null
    };
}


//bonus feature: friend request notification
export async function friendRequest(sendingUser) {
    return {
        type: "FRIEND_REQUEST",
        friendRequest: sendingUser
    };
}

export async function closeFriendRequest() {
    return {
        type: "FRIEND_REQUEST",
        friendRequest: null
    };
}
