﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { UpdateJobModal } from './UpdateJobModal.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Modal } from 'semantic-ui-react';
//import paginate from './Pagination.jsx';


export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        console.log(loader)
        this.state = {
            loadJobs: [],
            bool: true,
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true,
                showDraft: true,
                showExpired: true,
                showUnexpired: true,
            },
            editJob: {
                isOpen: false,
                record: []
            },
            activeIndex: "",
            jobsTitle: "",
            emptyData: false
            }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.paginate = this.paginate.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.filterJobs = this.filterJobs.bind(this);
        this.updateJob = this.updateJob.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )

        console.log(this.state.loaderData)

    }

    componentDidMount() {
        this.init();

    };

    loadData(callback) {

        var params = {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            }
            console.log("params:" + this.state.activePage + this.state.sortBy.date + this.state.filter.showActive + this.state.filter.showClosed + this.state.filter.showExpired + this.state.filter.showUnexpired)
            var cookies = Cookies.get('talentAuthToken');
            $.ajax({
                url: 'http://localhost:51689/listing/listing/getSortedEmployerJobs',
                data: params,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                success: function (res) {
                    let jobData = null;
                    let count = 0;
                    if (res.myJobs) {
                        if (res.myJobs.count == 0) {
                            this.setState({ emptyData: true })
                        } else {
                            jobData = res.myJobs
                            count = res.TotalCount
                            this.setState({ emptyData: false })
                            console.log("job data:" + jobData.jobDetails)
                            this.setState({
                                loadJobs: jobData
                            })
                        }
                    }

                }.bind(this),
                error: function (res) {
                    console.log(res.status)
                }
            })
        //   this.init()
    }


    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    paginate(pageInfo) {
        console.log(pageInfo.activePage);
        this.setState({
            activeIndex: pageInfo.activeIndex,
            activePage: pageInfo.activePage
        }, () => console.log("pagination called")
        )
    }

    sortByDate(e) {
        if (e.target.value == 'Oldest Date') {
            this.setState({
                sortBy: { date: 'asc' }
            }, () => this.loadData()
            );
            
        }
        else{
            this.setState({
                sortBy: { date: 'desc' }
            }, () => this.loadData()
            
            );
        }
    }
    filterJobs(e, data) {
        console.log("filter value " + data.value);
        this.setState({ jobsTitle: data.value, activePage :1 })
        switch (data.value) {
            case "Active Jobs":
                this.setState({
                    filter: { showActive: true, showClosed: false, showExpired: true, showUnexpired: true, showDraft: true }
                }, () => this.loadData()
                );
                break;
            case "Closed Jobs":
                this.setState({
                    filter: { showActive: false, showClosed: true, showExpired: true, showUnexpired: true, showDraft: true }
                }, () => this.loadData()
                );
                break;
            case "Expired Jobs":
                this.setState({
                    filter: { showActive: true, showClosed: true, showExpired: true, showUnexpired: false, showDraft: true }
                }, () => this.loadData()
                );
                break;
            case "Draft Jobs":
                this.setState({
                    filter: { showActive: true, showClosed: true, showExpired: true, showUnexpired: true, showDraft:false }
                }, () => this.loadData()
                );
                break;
            case "Unexpired Jobs":
                this.setState({
                    filter: { showActive: true, showClosed: true, showExpired: false, showUnexpired: true, showDraft: true }
                }, () => this.loadData()
                );
                break;
            default:
                break;
        }
        console.log("Active : " + this.state.filter.showActive + " Closed : " + this.state.filter.showClosed + " Expired : " + this.state.filter.showExpired + " UnExpired : " + this.state.filter.showUnexpired);

    }

    updateJob(selectedjob) {
        this.setState({
            editJob: {
                isOpen: true,
                record: selectedjob
            }
        }, () => console.log("update job called" + selectedjob.jobDetails.jobType)
        );
        
    }

    static renderJobsCards(myJobs, currentpage, ctrl) {
        console.log(currentpage);
        const indexOfLastPost = currentpage * 6;
        const indexOfFirstPost = indexOfLastPost - 6;

        const currentJobs = myJobs.slice(indexOfFirstPost, indexOfLastPost)
        console.log(currentJobs);
        const totalJobs = myJobs.length;

        const filters = [
            {
                key:'AJ',
            name: 'Active Jobs',
            value: 'Active Jobs',
            },
            {
                key: 'CJ',
            name:'Closed Jobs',
            value: 'Closed Jobs'
            },
            {
                key: 'DJ',
             name: 'Draft Jobs',
             value: 'Draft Jobs'
            },
            {
                key: 'EJ',
            name: 'Expired Jobs',
            value: 'Expired Jobs'
            },
            {
                key: 'UJ',
            name: 'Unexpired Jobs',
            value: 'Unexpired Jobs'
            }
            ]
return (
    <div className="job-card-section">
        <div>
            <h3>List of Jobs</h3>
            <Icon name='filter' />Filter :&nbsp;
            <Dropdown className="filter" text={ctrl.state.jobsTitle} placeholder="Choose Filter" icon="angle down">
                <Dropdown.Menu>
                    {filters.map((filter) => {
                        return (<Dropdown.Item key={filter.key} value={filter.value} onClick={(e,data) => { ctrl.filterJobs(e,data) }}>{filter.name}</Dropdown.Item>)
                })}
                    </Dropdown.Menu>
            </Dropdown>


            <Icon name='calendar' />Sort by date :&nbsp;
            <select onChange={(e) => { ctrl.sortByDate(e) }}>
                <option>Newest Date</option>
                <option onClick>Oldest Date</option>
            </select>

        </div>
        {ctrl.state.emptyData && (
            <div>No jobs Found</div>
        )
        }


             <div class = "ui stackable three cards">

                {currentJobs.map((myJob) => {
                    return (

                        <JobSummaryCard id={myJob.id} title={myJob.title} status={myJob.status} expiry={myJob.expiryDate} city={myJob.location.city} country={myJob.location.country} summary={myJob.summary} jobDetails={myJob.jobDetails} onUpdateJob={(id) => { ctrl.updateJob(myJob) }}>
                            
                            
                        </JobSummaryCard>
                    )
                })}

            {ctrl.state.editJob.isOpen && (
                <UpdateJobModal myJob={ctrl.state.editJob.record}>
                
                </UpdateJobModal>
            )
            }
        </div>
        

        <div className="job-pagination">
            <Pagination
                defaultActivePage={currentpage}
                    totalPages={Math.ceil(totalJobs / 6)}
                    //totalPages={5}
                    onPageChange={(e, pageInfo) => ctrl.paginate(pageInfo)}
                />
 
 </div>
    </div>
)
    }

render() {
    return (
        <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
            <div className="ui container">
                {ManageJob.renderJobsCards(this.state.loadJobs, this.state.activePage, this)}
            </div>
        </BodyWrapper>
    )
}
}