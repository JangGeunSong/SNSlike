import React, { Component } from 'react'
import Link from 'next/link'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar'

class About extends Component {

    componentDidMount() {
        document.title = "About"
    }

    render() {
        return (
            <div className="about">
                <Title />
                <Navbar />
                <div className="contentContainer">
                    <h1>This is about page</h1>
                </div>
            </div>
        )
    }
}

export default About
