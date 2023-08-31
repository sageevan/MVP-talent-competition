import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import paginate from './Pagination.jsx';


export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
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
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            postsPerPage: 6,
            currentPage : 1

        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
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
        console.log("test called");
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:51689/listing/listing/getEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let jobData = null;
                if (res.myJobs) {
                    jobData = res.myJobs
                }
                this.setState({
                    loadJobs: jobData
                })
                console.log(this.state.loadJobs[0].summary);
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
    paginate(pageNumber) {
        this.setState({ currentPage: pageNumber });
    }

    previousPage(){
        if (currentPage !== 1) {
            this.setState(currentPage = currentPage - 1);
        }
    };

    nextPage(){
        if (currentPage !== Math.ceil(blogPosts.length / postsPerPage)) {
            this.setState(currentPage = currentPage + 1);
        }
    };

    static renderJobsCards(myJobs, currentpage, postsperpage) {
        const indexOfLastPost = currentpage * postsperpage;
        const indexOfFirstPost = indexOfLastPost - postsperpage;
        const currentJobs = myJobs.slice(indexOfFirstPost, indexOfLastPost);
        const totalJobs = myJobs.length;
        console.log(myJobs)
        return (
            <div className="job-card-section">
            <div className="card-container">
                <div className="job-cards">
                    
                        {currentJobs.map((myJob,index) => {
                            return (
                        <div className="job-card">
                            <JobSummaryCard key={myJob.id} title={myJob.title} summary={myJob.summary}>
                                    </JobSummaryCard></div>
                            )
                        })}
                        <Pagination totalPosts={totalJobs} postsPerPage={postsperpage} paginate={this.paginate} previousPage = { this.previousPage } nextPage = { this.nextPage } ></Pagination>
                    
                    </div>
                </div>
</div>
        )
    }

    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    {ManageJob.renderJobsCards(this.state.loadJobs, this.state.currentPage, this.state.postsPerPage)} 
                </div>
            </BodyWrapper>
        )
    }
}