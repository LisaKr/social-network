//a component for showing bio of another user

import React from "react";

export default class BioOpp extends React.Component {
    constructor(props) {
        super(props);

        this.state= {};
    }

    render() {
        return(
            <div className="bio-opp-container">
                {/*Only two options: either the other user has a bio or not. no editing functionality
                bio is being passed as a prop from the parent component (otherPersonProfile)*/}
                {this.props.bio && <div className="bio-opp"> {this.props.bio} </div>}
                {!this.props.bio && <div className="bio-opp"> No bio yet </div>}
            </div>
        );
    }
}
