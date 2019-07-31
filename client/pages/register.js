import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import './pageStyle.css'

import Navbar from '../components/Navbar/Navbar';

class register extends Component {

    state = {
        isRegisterComplete: false
    }

    componentDidMount() {
        document.title = "Register"
    }

    // name: String!
    // email: String!
    // password: String!
    // profile_image: String
    // profile: String

    render() {

        const CREATE_USER = gql `
            mutation createUser($name: String!, $email: String!, $password: String!, $profile_image: String, $profile: String) {
                createUser(userInput: { name: $name, email: $email, password: $password, profile_image: $profile_image, profile: $profile }) {
                    _id
                }
            }
        `

        let NAME, EMAIL, PASSWORD, PROFILE_IMG, PROFILE;

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
                    <ApolloConsumer>
                        {client => {
                            <Mutation
                                mutation={CREATE_USER}
                                onCompleted={() => {
                                    this.setState({ isRegisterComplete: true });
                                }}
                            >
                                {(createuser, { loading, error }) => {
                                    if(loading) return <p>Loading...</p>
                                    if(error) return <p>Error is occured!</p>

                                    return (
                                        <form className="form__control" onSubmit={e => {
                                            e.preventDefault()
                                            createuser({ variable: { name: NAME.value, email: EMAIL.value, password: PASSWORD.value, profile_image: PROFILE_IMG.value, profile: PROFILE.value } })
                                        }}>
                                            <h1>Register Page</h1>
                                            <input type="text" placeholder="email" ref={emailValue => { EMAIL = emailValue }}/>
                                            <input type="password" placeholder="password" ref={passwordValue => { PASSWORD = passwordValue }}/>
                                            <input type="text" placeholder="name" ref={nameValue => { NAME = nameValue }}/>
                                            <input type="text" placeholder="profile" ref={profileValue => { PROFILE = profileValue }}/>
                                            <input type="text" placeholder="profile_image" ref={profileIMGValue => { PROFILE_IMG = profileIMGValue }}/>
                                            <button className="form__button">Submit</button>
                                        </form>
                                    )
                                }}
                            </Mutation>
                        }}
                    </ApolloConsumer>
                </div>
            </div>
        )
    }
}

export default register
