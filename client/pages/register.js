import React, { Component } from 'react'
import Link from 'next/link'

import './pageStyle.css'

import Navbar from '../components/Navbar/Navbar';

class register extends Component {

    componentDidMount() {
        document.title = "Register"
    }

    render() {
        return (
            <div>
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
                    Welcome to Register page
                </div>
            </div>
        )
    }
}

export default register
