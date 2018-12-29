import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome';
import App from './app';
import reduxPromise from 'redux-promise';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {initSocket} from "./socket";

import { hideResults } from "./actions.js";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));


//deciding which component to render depending on which route the user is taking
let component;

if (location.pathname === "/welcome") {
    component = <Welcome/>;
} else {
    component = (
        //initializing socket and redux
        initSocket(store),
        <Provider store={store}>
            <App />
        </Provider>);
}

//rendering the selected component
ReactDOM.render(
    component,
    document.querySelector('main')
);


//to hide search results by clicking anywhere else in the document
document.addEventListener("click", function(){
    let search = document.querySelector(".searchbar");
    search.value = '';
    store.dispatch(hideResults());
});
