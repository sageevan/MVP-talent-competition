import React from 'react';
import Cookies from 'js-cookie';
import { Button,Icon, Popup } from 'semantic-ui-react';
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
    expiryStatus(expiryDate) {
        console.log("expirycalled")
        console.log(expiryDate + moment().toISOString(new Date()))
        if (expiryDate < moment().toISOString(new Date())) {
            
            return "Expired";
        } else {
            return null;
        }
    }

 
    render() {
        return (
                //<div className="job-card-body">
                //    <p className="key" key={this.props.key}></p>
                //<h3 className="job-card-title">{this.props.title}</h3>
                //<p className="job-card-location">{this.props.city},{this.props.country}</p>
                //<p className="job-card-summary">{this.props.summary}</p>
                //<label name="status">{this.props.status}</label>
                //<label className="job-card-expiry">{this.expiryStatus(this.props.expiry)}</label>
                //<div className="job-card-btn">
                //    <button onClick={() => { this.selectJob(this.props.closeButton) }}><i class="close icon">Close</i></button>
                //    <button onClick={() => { this.editJob(this.props.closeButton) }}><i class="edit icon">Edit</i></button>
                //    <button onClick={() => { this.copyJob(this.props.closeButton) }}><i class="copy icon">Copy</i></button>
                //</div>
                
            //</div>
            <div class="card">
            <div class="content">
                        <div class="header">{this.props.title}</div>
                        <div class="meta">{this.props.city},{this.props.country}</div>
                        <div class="description">{this.props.summary}</div>
            </div>
                    <div class="extra content">
                        <p class="ui label">{this.expiryStatus(this.props.expiry)}</p>
                        <div class="buttons">
                            <Button class="button" animated='fade' onClick={() => { this.selectJob(this.props.closeButton) }}>
                                <Button.Content visible><Icon name='close icon'/></Button.Content>
                                <Button.Content hidden>Close</Button.Content>
                            </Button>
                        <Button class="button" animated='fade' onClick={() => { this.editJob(this.props.closeButton) }}>
                                <Button.Content visible><Icon name='edit icon' /></Button.Content>
                                <Button.Content hidden>Edit</Button.Content>
                            </Button>
                        <Button class="button" animated='fade' onClick={() => { this.copyJob(this.props.closeButton) }}>
                                <Button.Content visible><Icon name='copy icon' /></Button.Content>
                                <Button.Content hidden>Copy</Button.Content>
                            </Button>
                        </div>
                    </div>

                    </div>
        )
    }
}