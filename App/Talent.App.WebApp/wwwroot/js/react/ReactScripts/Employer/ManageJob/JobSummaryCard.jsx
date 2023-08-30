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
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

 
    render() {
        return (
            <div>
                    <h4 className="job-card-title">{this.props.title}</h4>
                    <p className="job-card-summary">{this.props.summary}</p>
</div>
        )
    }
}