import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar';

class login extends Component {

    state = {
        isLoginComplete: false
    }

    componentDidMount() {
        document.title = "login"
    }

    render() {
        const LOGIN_USER = gql`
            mutation login($email: String!, $password: String!){
                login(loginInput: {email: $email, password: $password}){
                    userId
                    userName
                    token
                    tokenExpiration
                }
            }
        `

        let EMAIL: string;
        let PASSWORD: string;

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
                            {client => (
                                <Mutation
                                    mutation={LOGIN_USER}
                                    onCompleted={({ login } : { login: any }) => {
                                        console.log(login)
                                        localStorage.setItem('token', login.token);
                                        localStorage.setItem('tokenExpiration', login.tokenExpiration);
                                        localStorage.setItem('userName', login.userName);
                                        localStorage.setItem('userId', login.userId);
                                        this.setState({ isLoginComplete: true });
                                        client.cache.writeData({
                                            data: {
                                                token: login.token,
                                                tokenExpiration: login.tokenExpiration,
                                                useName: login.userName,
                                                userId: login.userId,
                                            },
                                        })
                                    }}
                                >
                                    {(login: any, { loading, error }: any) => {
                                        if(loading) return <p>Loading...</p>
                                        if(error) return <p>Error is occured!</p>
                                        
                                        return (
                                            <form className="form__control" onSubmit={e => {
                                                e.preventDefault();
                                                login({ variables: {email: EMAIL, password: PASSWORD} })
                                            }}>
                                                <h1>Login page</h1>
                                                <input type="text" placeholder="type your ID" ref={emailValue =>{
                                                    if(emailValue === null) {
                                                        EMAIL = '';
                                                    }
                                                    else {
                                                        EMAIL = emailValue.value
                                                    }
                                                }}/>
                                                <input type="password" placeholder="type your Password" ref={PSV => {
                                                    if(PSV === null) {
                                                        PASSWORD = '';
                                                    }
                                                    else {
                                                        PASSWORD = PSV.value
                                                    }
                                                }}/>
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