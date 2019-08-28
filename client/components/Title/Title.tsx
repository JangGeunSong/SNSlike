import React, { Component } from 'react'
import Link from 'next/link'

export class Title extends Component {

    state = {
        isLoggedIn: false
    }

    componentDidMount() {
        if(localStorage.getItem('token') === null) {
            this.setState({ isLoggedIn: false });
        }
        else {
            this.setState({ isLoggedIn: true })
        }
    }

    logout = () => {
        localStorage.clear();
        this.setState({ isLoggedIn: false })
        window.location.reload();
    }

    render() {
        return (
            <div className="title">
                <Link href="/"><a>Title</a></Link>
                {this.state.isLoggedIn ?
                (
                    <div className="button__bundle">
                        <button className="title__login">
                            <p>Hello {localStorage.getItem('userName')}</p>
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
        )
    }
}

export default Title
