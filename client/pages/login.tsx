import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar'

class login extends Component {

    state = {
        isLoginComplete: false,
        email: null,
        password: null,
    }

    constructor(props: any) {
        super(props)
        this.onEmailHandle = this.onEmailHandle.bind(this);
        this.onPasswordHandle = this.onPasswordHandle.bind(this);
    }

    componentDidMount() {
        document.title = "login"
    }

    onEmailHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.currentTarget.value })
    }

    onPasswordHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: e.currentTarget.value })
    }

    render() {
        const LOGIN_USER = gql`
            mutation login($email: String!, $password: String!){
                login(loginInput: {email: $email, password: $password}){
                    userName
                    token
                    tokenExpiration
                }
            }
        `


        return (
            <div>
                <Title />
                <Navbar />
                <div className="contentContainer">
                    {this.state.isLoginComplete ?
                    (
                        <div>
                            <h1>Login Success</h1>
                            <Link href="/"><a>Go To Home</a></Link>
                        </div>
                    )
                    :
                    (
                        <ApolloConsumer>
                            {() => (
                                <Mutation
                                    mutation={LOGIN_USER}
                                    onCompleted={({ login } : { login: any }) => {
                                        console.log(login)
                                        localStorage.setItem('token', login.token);
                                        localStorage.setItem('tokenExpiration', login.tokenExpiration);
                                        localStorage.setItem('userName', login.userName);
                                        this.setState({ isLoginComplete: true });
                                    }}
                                >
                                    {(login: any, { loading, error }: any) => {
                                        if(loading) return <p>Loading...</p>
                                        if(error) return <p>Error is occured!</p>
                                        
                                        return (
                                            <form className="form__control" onSubmit={e => {
                                                e.preventDefault();
                                                login({ variables: {email: this.state.email, password: this.state.password} })
                                            }}>
                                                <h1>Login page</h1>
                                                <input type="text" placeholder="type your ID" onChange={this.onEmailHandle} />
                                                <input type="password" placeholder="type your Password" onChange={this.onPasswordHandle} />
                                                <button className="form__button">Login</button>
                                            </form>
                                        )
                                    }}
                                </Mutation>
                            )}
                        </ApolloConsumer>
                    )
                    }
                    
                </div>
            </div>
        )
    }
}

export default login