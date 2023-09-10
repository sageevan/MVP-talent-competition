import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Dropdown, Modal } from 'semantic-ui-react'
import { countryOptions } from '../common.js'
import { JobDetailsCard } from '../CreateJob/JobDetailsCard.jsx';
import { JobApplicant } from '../CreateJob/JobApplicant.jsx';
import { ChildSingleInput } from '../../Form/SingleInput.jsx'
import { JobDescription } from '../CreateJob/JobDescription.jsx';
import { JobSummary } from '../CreateJob/JobSummary.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';


export class UpdateJobModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobData: {
                id: "",
                employerID: "",
                title: "",
                description: "",
                summary: "",
                applicantDetails: {
                    yearsOfExperience: { years: 1, months: 1 },
                    qualifications: [],
                    visaStatus: []
                },
                jobDetails: {
                    categories: { category: "", subCategory: "" },
                    jobType: [],
                    startDate: moment(),
                    salary: { from: 0, to: 0 },
                    location: { country: "", city: "" }
                }
            },
            loaderData: loaderData
        }
        this.showModal = this.showModal.bind(this)
        this.updateStateData = this.updateStateData.bind(this)
        this.addUpdateJob = this.addUpdateJob.bind(this)
    }
    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Employer");
        loaderData.allowedUsers.push("Recruiter");
        loaderData.isLoading = false;
        this.setState({ loaderData, })
    }

    componentDidMount() {
        this.showModal();
        this.init();
    };

    addUpdateJob() {
        var jobData = this.state.jobData
        console.log("data to save:" + jobData.summary);
        //jobData.jobDetails.startDate = jobData.jobDetails.startDate.toDate();
        //console.log("date:", jobData.jobDetails.startDate);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:51689/listing/listing/createUpdateJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(jobData),
            success: function (res) {
                if (res.success == true) {
                    console.log(res.message)
                    TalentUtil.notification.show(res.message, "success", null, null);
                    window.location = "/ManageJobs";

                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }

            }.bind(this)
        })
    }

    showModal() {
        this.setState({
            jobData: this.props.myJob

        }, () => console.log("Recceived job for editting" + this.state.jobData.jobDetails.jobType)
        );
    }
    updateStateData(event) {
        const data = Object.assign({}, this.state.jobData)
        data[event.target.name] = event.target.value
        this.setState({
            jobData: data
        })
        console.log(data);
    }

    render() {
        
        // this.showModal();
        return (
            <Modal class="update-job-modal"
                open
                //    onClose={true}
                closeOnDimmerClick={false}
                //     closeOnEscape={true}
                closeIcon

                header={"Title"}
                content={(
                    <Modal.Content>
                        <section className="page-body">
                            <div className="ui container">
                                <div className="ui grid">
                                    <div className="row">
                                        <div className="sixteen wide center aligned padded column">
                                            <h1>Create Job</h1>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="sixteen wide column">
                                            <div className="ui form">
                                                <div className="ui grid">
                                                    <div className="row">
                                                        <div className="twelve wide column">
                                                            <label>* are required fields. Please enter all required fields.</label>
                                                            <h5>
                                                                *Title:
                                                            </h5>
                                                            <ChildSingleInput
                                                                inputType="text"
                                                                name="title"
                                                                value={this.state.jobData.title}
                                                                 controlFunc={this.updateStateData}
                                                                maxLength={80}
                                                                placeholder="Enter a title for your job"
                                                                errorMessage="Please enter a valid title"
                                                            />
                                                            <h5>
                                                                *Description:
                                                            </h5>
                                                            <JobDescription
                                                                description={this.state.jobData.description}
                                                                controlFunc={this.updateStateData}
                                                            />
                                                            <br />
                                                            <h5>
                                                                *Summary:
                                                            </h5>
                                                            <JobSummary
                                                                summary={this.state.jobData.summary}
                                                               updateStateData={this.updateStateData} 
                                                            />
                                                            <br />

                                                            <br />
                                                    
                                                            

                                                            <br />
                                                        </div>
                                                        <div className="four wide column">
                                                            <JobDetailsCard 
                                                                expiryDate={this.state.jobData.expiryDate}
                                                                jobDetails={this.state.jobData.jobDetails} 

                                                                updateStateData={this.updateStateData} 
                                                                createClick={this.addUpdateJob} />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                        </section>
                    </Modal.Content>
                )}
            />
            //<div class="modal">
            //    <div class="header">Header</div>
            //    <div class="content">
            //        <p>Sha</p>
            //        <p>Sha</p>
            //        <p>Sha</p>
            //    </div>
            //    </div>
            //</Modal>



            //<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
            //    <section className="page-body">
            //        <div className="ui container">
            //            <div className="ui grid">
            //                <div className="row">
            //                    <div className="sixteen wide center aligned padded column">
            //                        <h1>Create Job</h1>
            //                    </div>
            //                </div>

            //                <div className="row">
            //                    <div className="sixteen wide column">
            //                        <div className="ui form">
            //                            <div className="ui grid">
            //                                <div className="row">
            //                                    <div className="twelve wide column">
            //                                        <label>* are required fields. Please enter all required fields.</label>
            //                                        <h5>
            //                                            *Title:
            //                                        </h5>
            //                                        <ChildSingleInput
            //                                            inputType="text"
            //                                            name="title"
            //                                            value={this.state.jobData.title}
            //                                            controlFunc={this.updateStateData}
            //                                            maxLength={80}
            //                                            placeholder="Enter a title for your job"
            //                                            errorMessage="Please enter a valid title"
            //                                        />
            //                                        <h5>
            //                                            *Description:
            //                                        </h5>
            //                                        <JobDescription
            //                                            description={this.state.jobData.description}
            //                                            controlFunc={this.updateStateData}
            //                                        />
            //                                        <br />
            //                                        <h5>
            //                                            *Summary:
            //                                        </h5>
            //                                        <JobSummary
            //                                            summary={this.state.jobData.summary}
            //                                            updateStateData={this.updateStateData} />
            //                                        <br />

            //                                        <br />
            //                                        <JobApplicant
            //                                            applicantDetails={this.state.jobData.applicantDetails}
            //                                            updateStateData={this.updateStateData}
            //                                        />
            //                                        <br />
            //                                    </div>
            //                                    <div className="four wide column">
            //                                        <JobDetailsCard
            //                                            expiryDate={this.state.jobData.expiryDate}
            //                                            jobDetails={this.state.jobData.jobDetails}
            //                                            updateStateData={this.updateStateData}
            //                                            createClick={this.addUpdateJob}
            //                                        />
            //                                    </div>
            //                                </div>
            //                            </div>
            //                        </div>
            //                    </div>
            //                </div>
            //            </div>
            //        </div>
            //        <br />
            //        <br />
            //    </section>
            //</BodyWrapper>
        )
    }
}