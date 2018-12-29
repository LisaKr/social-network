//incremental search
import React from "react";
import { connect } from "react-redux";
import { getSearchResults } from "./actions.js";
import { Link } from 'react-router-dom';



class Search extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return(
            <div className="search-container">
                <input
                    className = "searchbar"
                    type="text"
                    placeholder="Search Petwork" onChange={e =>
                        this.props.dispatch(getSearchResults(e.target.value))
                    }/>

                <div className="searchResults">
                    {this.props.searchResults && this.props.searchResults.map(
                        r => {
                            return (
                                <div key={r.id} className="results-container">
                                    <Link to={`/user/${r.id}`} className="no-underline">
                                        <div className="result-info">
                                            <div className="result-name">{r.first} {r.last}</div>
                                            <div className="result-pic">
                                                <img className="profile" src={r.imgurl || "/1.jpg"} />
                                            </div>
                                            <div className="result-error">{r.error}</div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        searchResults: state.searchResults
    };
}

export default connect(mapStateToProps)(Search);
