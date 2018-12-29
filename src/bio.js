import React from "react";
import axios from "./axios";

export default class Bio extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formShown: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showEditForm = this.showEditForm.bind(this);
        this.hideEditForm = this.hideEditForm.bind(this);
    }

    //when we type in the bio textarea it gets saved to the state of bio. property name corresponds to the name we gave the textarea
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    //
    async handleSubmit() {
        try {
            //if the user has put anything in the bio it gets updated in the db
            //the bio is updated in the parent components state by trigerring the passed props function
            if (this.state.bio) {
                let resp = await axios.post("/update-bio", this.state);
                this.props.setBio(resp.data.bio);
                this.setState({
                    formShown: false
                });
            //if the user didn't change anything in the form, the bio is reset to the passed existing bio
            } else if (this.state.bio == null) {
                this.props.setBio(this.props.bio);
                this.setState({
                    formShown: false
                });
            }
        } catch(err) {
            console.log("ERROR IN SENDING BIO TO THE SERVER", err);
        }
    }
    //internal component functions to show and hide the bio edit form
    showEditForm() {
        this.setState({
            formShown: true
        });
    }

    hideEditForm() {
        this.setState({
            formShown: false
        });
    }

    render() {
        return(
            <div className="bio-container">
                {/*Option 1: if there is already bio in state it just gets shown together with the edit button.
                Clicking the edit button shows the edit form*/}
                { this.props.bio &&
                    <div className="bio">
                        { this.props.bio } <br/>
                        <img className="icon edit" src="/edit.png" onClick={this.showEditForm}/>
                    </div>
                }

                {/*Option 2: if there is NO bio in state we only show the edit button.
                    Clicking the edit button shows the edit form*/}
                { !this.props.bio &&
                    <div className="bio-button">
                        <img className="icon edit" src="/edit.png" onClick={this.showEditForm}/>
                    </div>
                }

                {/*When clicking on the edit button: form is shown, inside is the current bio. On every change bio in state
                gets changed. On submit */}
                {this.state.formShown &&
                    <div className="bio-form-container">
                        <div className="closingbutton-bio" onClick={this.hideEditForm}> X </div>
                        <div className="bio-form">
                            <h2> Edit your bio </h2>
                            <textarea name="bio" onChange={this.handleChange} defaultValue={this.props.bio} />
                            <button className="icon-button" onClick={this.handleSubmit}> <img className="icon" src="/save.png"/> </button>
                        </div>
                    </div>

                }

            </div>
        );
    }
}
