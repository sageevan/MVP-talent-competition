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
            dataType: 'json',
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                    window.location = "/ManageJobs";

                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }

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

    editJob(id) {
        console.log(id)
    }
    copyJob(id) {
        console.log(id)
    }
    render() {
        
        return (
            <div class="card">
            <div class="content">
                        <div class="header">{this.props.title}</div>
                        <div class="meta">{this.props.city},{this.props.country}</div>
                        <div class="description">{this.props.summary}</div>
            </div>
                    <div class="extra content">
                        <p class="ui label">{this.expiryStatus(this.props.expiry)}</p>
                        <div class="buttons">
                            <Button class="button" animated='fade' onClick={() => { this.selectJob(this.props.id) }}>
                                <Button.Content visible><Icon name='close icon'/></Button.Content>
                                <Button.Content hidden>Close</Button.Content>
                            </Button>
                        <Button class="button" animated='fade' onClick={ (e,data) => this.props.onUpdateJob(e,data) }>
                                <Button.Content visible><Icon name='edit icon' /></Button.Content>
                                <Button.Content hidden>Edit</Button.Content>
                            </Button>
                        <Button class="button" animated='fade' onClick={() => { this.copyJob(this.props.id) }}>
                                <Button.Content visible><Icon name='copy icon' /></Button.Content>
                                <Button.Content hidden>Copy</Button.Content>
                            </Button>
                        </div>
                    </div>

                    </div>
        )
    }
}