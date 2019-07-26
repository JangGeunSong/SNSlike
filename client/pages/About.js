import React, { Component } from 'react'
import Link from 'next/link'

import './pageStyle.css'

import Navbar from '../components/Navbar/Navbar'

class About extends Component {

    componentDidMount() {
        document.title = "About"
    }

    render() {
        return (
            <div className="about">
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
                <div className="contentContainer">
                    <h1>This is about page</h1>
                </div>
            </div>
        )
    }
}

export default About
