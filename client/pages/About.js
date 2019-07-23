import React, { Component } from 'react'
import Link from 'next/link'

import Navbar from '../components/Navbar/Navbar'
import './About.css'

class About extends Component {
    render() {
        return (
            <div className="about">
                <div className="title">
                    <Link href="/">Title</Link>
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
