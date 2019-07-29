import React, { Component } from 'react'
import { withRouter } from 'next/router'
import Link from 'next/link'

import './pageStyle.css';

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
                    <div className="button__bundle">
                        <Link href="/login">
                            <button className="title__login">
                                <a>Login</a>
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className="title__register">
                                <a>Sign Up</a>
                            </button>
                        </Link>
                    </div>
                </div>
                <Navbar />
                <React.Fragment>
                    <div className="contentContainer">
                        <Articles />   
                    </div>
                </React.Fragment>
            </div>
        )
    }
}

export default withRouter(index);