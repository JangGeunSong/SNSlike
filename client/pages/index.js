import React, { Component } from 'react'
import { withRouter } from 'next/router'
import Link from 'next/link'

import './index.css';

import Navbar from '../components/Navbar/Navbar';
import Articles from '../components/Articles/Articles';

class index extends Component {

    componentDidMount() {
        document.title = "Home"
    }

    render() {
        return (
            <div className="home">
                    <div className="title">
                        <Link href="/"><a>Title</a></Link>
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