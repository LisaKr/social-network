import React from 'react';
import axios from './axios';
import Logo from './logo';
import { Link } from 'react-router-dom';



export default class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(e) {

        //to use event property we use es6 to tell the object to refer to the event and not take it as a name
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    //when we press the button in the form
    async handleSubmit(e) {
        //preventing refreshing the page
        e.preventDefault();
        try {
            let res = await axios.post("/registration", this.state);
            console.log("RESPONSE ON THE FRONT", res);
            //if everything went well we want to redirect the user to the slash route where we render the logo component
            //if we sent an error from the server we will just change the state property "error" causing welcome
            //element to re-render and show it
            if (res.data.error) {
                this.setState({
                    error: "Oops! Something went wrong, please try again!"
                });
            //if we didn't send an error we just redirect through manipulating the url
            } else {
                location.replace("/");
            }
        } catch(err) {
            console.log("ERROR ON THE FRONT", err);
        }
    }

    render(){
        return (
            <div className="registration-container">
                <div className="welcome-logo"> <Logo/> </div>

                <form onSubmit={this.handleSubmit}>
                    <input className="welcome-input" onChange= {this.handleChange} name="first" type="text" placeholder="first name" autoComplete="off"/>
                    <input className="welcome-input" onChange= {this.handleChange} name="last" type="text" placeholder="last name" autoComplete="off"/>
                    <input className="welcome-input" onChange= {this.handleChange} name="email" type="text" placeholder="email" autoComplete="off"/>
                    <input className="welcome-input" onChange= {this.handleChange} name="password" type="password" placeholder="password" autoComplete="off"/>
                    <break></break>
                    <div className="scene">
                        <div className="cube">
                            <button className="front small reg-front"> SIGN UP </button>
                            <button className="bottom small reg-bottom"> SIGN UP </button>
                        </div>
                    </div>
                </form>

                <p>{this.state.error}</p>
                <Link to = "/login" className="link"> Already registered? Click here to log in! </Link>
            </div>
        );
    }
}
