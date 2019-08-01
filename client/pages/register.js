import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import './pageStyle.css'

import Navbar from '../components/Navbar/Navbar';

class register extends Component {

    state = {
        isRegisterComplete: false,
        name: null
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
                    {this.state.isRegisterComplete ? 
                        (
                            <div>
                                <h1>create {this.state.name} is complete!</h1>
                                <p>Please login</p>
                                <Link href="/login"><a>Here</a></Link>
                            </div>
                        )
                        :
                        (
                            <ApolloConsumer>
                                {client => (
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
                                                    e.preventDefault();
                                                    createuser({ variables: { name: NAME.value, email: EMAIL.value, password: PASSWORD.value, profile_image: PROFILE_IMG.value, profile: PROFILE.value } });
                                                    this.setState({ isRegisterComplete: true, name: NAME.value });
                                                }}>
                                                    <h1>Register Page</h1>
                                                    <input type="text" placeholder="email" ref={emailValue => { EMAIL = emailValue }}/><br/>
                                                    <input type="password" placeholder="password" ref={passwordValue => { PASSWORD = passwordValue }}/><br/>
                                                    <input type="text" placeholder="name" ref={nameValue => { NAME = nameValue }}/><br/>
                                                    <input type="text" placeholder="profile" ref={profileValue => { PROFILE = profileValue }}/><br/>
                                                    <input type="text" placeholder="profile_image" ref={profileIMGValue => { PROFILE_IMG = profileIMGValue }}/><br/>
                                                    <button className="form__button">Submit</button><br/>
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

export default register
