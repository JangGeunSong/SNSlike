import React, { Component } from 'react'
import { withRouter } from 'next/router'
import Link from 'next/link'

import './pageStyle.css';

import Navbar from '../components/Navbar/Navbar';
import Articles from '../components/Articles/Articles';

class index extends Component {

    state = {
        isLoggedIn: false
    }

    componentDidMount() {
        document.title = "Home"
        if(localStorage.getItem('token') === null) {
            this.setState({ isLoggedIn: false });
            console.log(localStorage.getItem('token'));
        }
        else {
            this.setState({ isLoggedIn: true })
            console.log(localStorage.getItem('token'));
        }
    }

    logout = () => {
        localStorage.clear();
        this.setState({ isLoggedIn: false })
    }

    render() {
        return (
            <div className="home">
                <div className="title">
                    <Link href="/"><a>Title</a></Link>
                    {this.state.isLoggedIn ?
                    (
                        <div className="button__bundle">
                            <button className="title__login">
                                <p>Hello {localStorage.getItem('userId')}</p>
                            </button>
                            <button className="title__register" onClick={this.logout}>
                                <a>Logout</a>
                            </button>
                        </div>
                    )
                    :
                    (
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
                    )
                    }
                    
                </div>
                <Navbar />
                <React.Fragment>
                    {this.state.isLoggedIn ? 
                    (
                        <div className="contentContainer">
                            <Articles />   
                        </div>
                    ) :
                    (
                        <div className="contentContainer">
                            <p>You need to </p><Link href="/login"><a>Login</a></Link>
                        </div>
                    )}
                </React.Fragment>
            </div>
        )
    }
}

export default withRouter(index);