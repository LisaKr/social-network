export default function(state = {}, action) {

    if (action.type == 'GET_FRIENDS') {
        state = Object.assign({}, state, {
            friendsWannabes: action.friendsWannabes
        });
    }

    //friend button actions
    if (action.type == "DELETE_FRIEND") {
        state = Object.assign({}, state, {
            friendsWannabes: state.friendsWannabes.filter(
                friend => friend.id != action.deletedFriend
            )
        });
    }


    if (action.type == "ACCEPT_FRIEND") {

        state = Object.assign({}, state, {

            friendsWannabes: state.friendsWannabes.map(friend => {
                if (friend.id == action.addedFriend) {
                    //inside friendsWannabes we are copying the friend object and replacing the accepted property
                    //passing Object.assign an empty object, then the object we want to mutate, and then
                    //the property/value that we are changing/updating.
                    return Object.assign({}, friend, {accepted: true});
                    //we need an else statement to add the rest of the users that were not changed (and complete the object/state)
                } else {
                    return Object.assign({}, friend);
                }
            })
        });
    }

    //getting a list of online users, adding and removing users
    if (action.type == "ONLINE_USERS") {
        state = Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        });
    }

    if (action.type == "USER_JOINED") {
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.concat(action.userWhoJoined)
        });
    }

    if (action.type == "USER_LEFT") {
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.userWhoLeft
            )
        });
    }

    //chat work
    if (action.type=="SHOW_MESSAGES") {
        return {
            ...state,
            messages: action.messages
        };
    }

    if (action.type=="ADD_MESSAGE") {
        return {
            ...state,
            messages: state.messages.concat(action.newMessage)
        };
    }

    //incremental search
    if (action.type == "GET_SEARCH_RESULTS") {
        return {
            ...state,
            searchResults: action.searchResults
        };
    }

    //friend request notification
    if (action.type == "FRIEND_REQUEST") {
        return {
            ...state,
            friendRequest: action.friendRequest
        };
    }

    return state;
}
