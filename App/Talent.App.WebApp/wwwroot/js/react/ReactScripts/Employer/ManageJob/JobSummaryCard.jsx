import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        console.log(id);
        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            data: JSON.stringify(id),
            headers: {
                'Authorization': 'Bearer ' + cookies,
               'Content-Type': 'application/json'
            },
           type: "POST",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
              console.log("success"+res.message)
            }.bind(this),
            error: function (res) {
                console.log("error" + res.status + res.message)
            }
        })
    }

 
    render() {
        return (
                <div className="job-card-body">
                    <p className="key" key={this.props.key}></p>
                <h3 className="job-card-title">{this.props.title}</h3>
                <p className="job-card-location">{this.props.city},{this.props.country}</p>
                <p className="job-card-summary">{this.props.summary}</p>
                <button onClick={() => { this.selectJob(this.props.closeButton) }}>Close</button>
                <button onClick={() => { this.editJob(this.props.closeButton) }}>Edit</button>
                <button onClick={() => { this.copyJob(this.props.closeButton) }}>Copy</button>
                </div>
        )
    }
}