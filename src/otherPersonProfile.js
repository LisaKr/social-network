//component showing the entirety of other person's profile
import React from "react";
import axios from "./axios";

import ProfilePicOpp from "./profilePicOpp";
import BioOpp from "./bioOpp";
import FriendButton from "./friendButton";


export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //every time we go to another person's profile this component mounts
    async componentDidMount() {
        try {
            let resp = await axios.get("/user/" + this.props.match.params.id + "/info");
            //if there is no such user and we just put gibberish in our url we redirect to home
            if (resp.data.error) {
                this.props.history.push('/');
            }

            if (resp.data.ProfilePicUrl) {
                this.setState(resp.data);
            } else {
                resp.data.ProfilePicUrl = "/1.jpg";
                this.setState(resp.data);
            }

        } catch(err) {
            console.log("error in mounting opp", err);
        }
    }

    render() {
        return(
            <div className="opp-container">
                <ProfilePicOpp ProfilePicUrl = {this.state.ProfilePicUrl} />
                <div className="name-and-bio">
                    <div className="name"> {this.state.first} {this.state.last} </div>
                    <br/>
                    <BioOpp bio={this.state.bio} />
                    {/*for every user who are not me I show a friend button with a respective message*/}
                    <div className="relationship-button-friendpage"><FriendButton otherUserId={this.props.match.params.id}/></div>
                </div>
            </div>
        );
    }
}
