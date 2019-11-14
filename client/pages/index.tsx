import React, { Component } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import Link from 'next/link'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar';
import Articles from '../components/Articles/Articles';

interface Props {
    router: SingletonRouter
}

class index extends Component<Props> {

    state = {
        isLoggedIn: false
    }

    componentDidMount() {
        document.title = "Home"
        if(localStorage.getItem('token') === null) {
            this.setState({ isLoggedIn: false });
        }
        else {
            this.setState({ isLoggedIn: true })
        }
    }

    loginReset = (loginCondition: boolean) => {
        this.setState({ isLoggedIn: loginCondition });
    }

    render() {
        return (
            <div className="home">
                <Title />
                <Navbar />
                <React.Fragment>
                    {this.state.isLoggedIn ? 
                    (
                        <div className="contentContainer">
                            <Articles loginReset={this.loginReset} />   
                        </div>
                    ) :
                    (
                        <div className="contentContainer ml-35">
                            <p>You need to </p><Link href="/login"><a>Login</a></Link>
                        </div>
                    )}
                </React.Fragment>
            </div>
        )
    }
}

export default withRouter(index);