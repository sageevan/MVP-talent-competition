import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    render() {
        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(this.props.totalPosts / this.props.postsPerPage); i++) {
            pageNumbers.push(i);
        }
        return (
            <div>
                 <ul className="pagination">
                    <li onClick={this.props.previousPage} className="page-number">
                        Prev
                    </li>
                    {pageNumbers.map((pageNumber) => (
                        <li
                            key={pageNumber}
                             onClick={() => this.props.paginate(pageNumber)}
                            className="page-number"
                        >
                            {number}
                        </li>
                    ))}
                    <li onClick={this.props.nextPage} className="page-number">
                        Next
                    </li>
                </ul>
            </div>
        )
    }
}