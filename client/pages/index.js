import React, { Component } from 'react'
import { withRouter } from 'next/router'

import './index.css';

import Navbar from '../components/Navbar/Navbar';
import Articles from '../components/Articles/Articles';

class index extends Component {
    render() {
        return (
            <div className="home">
                <div className="title">
                    <a href="">Title</a>
                </div>
                <Navbar />
                <div className="contentContainer">
                    <Articles />   
                </div>
            </div>
        )
    }
}

export default withRouter(index);