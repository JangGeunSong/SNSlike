import React, { Component } from 'react'
import Link from 'next/link'

import Navbar from '../components/Navbar/Navbar'
import './About.css'

class About extends Component {

    componentDidMount() {
        document.title = "About"
    }

    render() {
        return (
            <div className="about">
                <div className="title">
                    <Link href="/"><a>Title</a></Link>
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
