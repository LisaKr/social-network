import React from 'react';
import axios from './axios';
import Logo from './logo';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    //when anything changes in the input field the respective information gets put into state
    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            let res = await axios.post("/login", this.state);
            if (res.data.error) {
                this.setState({
                    error: "Oops! Something went wrong, please try again!"
                });
            } else {
                location.replace("/");
            }
        } catch(err) {
            console.log(err);
        }
    }


    render() {
        return (
            <div className="login-container">
                <div className="welcome-logo"> <Logo/> </div>
                <form onSubmit={this.handleSubmit}>
                    <input className="welcome-input" type="text" name="email" placeholder="email" autoComplete="off" onChange={this.handleChange}/>
                    <input className="welcome-input" type="password" name="password" placeholder="password" autoComplete="off" onChange={this.handleChange}/>
                    <break></break>
                    <div className="scene">
                        <div className="cube">
                            <button className="front small"> LOG IN </button>
                            <button className="bottom small"> LOG IN </button>
                        </div>
                    </div>
                </form>
                <p className="error">{this.state.error}</p>
                <Link to="/registration" className="link">Not registered yet? Do it here!</Link>
            </div>
        );
    }
}
