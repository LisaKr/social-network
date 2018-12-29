import React from "react";
import axios from "./axios";


export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //when file gets selected it is being put in state
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }

    //when the upload button gets clicked
    async handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);

        try {
            let resp = await axios.post("/upload", formData);
            this.props.changePic(resp.data.imgurl);
        } catch(err) {
            console.log("ERROR IN THE UPLOADER", err);
        }
    }

    render() {
        return (
            <div className="uploader">
                <div className="closingbutton" onClick={this.props.hideUploader}>X</div>
                <h2> upload a new image </h2>
                <form className="image-form" onSubmit= {this.handleSubmit}>
                    <input name="file" type="file" accept="image/*" onChange = {this.handleChange}/>
                    <button className="icon-button"> <img className="icon" src="/save.png"/> </button>
                </form>
            </div>
        );
    }
}
