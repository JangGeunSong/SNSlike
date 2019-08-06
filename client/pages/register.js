import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'

import './pageStyle.css'

import Navbar from '../components/Navbar/Navbar';

class register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRegisterComplete: false,
            name: null,
            files: [],
        }
        this.onDrop = (files) => {
            this.setState({files})
            console.log(files)
        }
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

        let NAME, EMAIL, PASSWORD, PROFILE;

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
                                                    createuser({ variables: { name: NAME.value, email: EMAIL.value, password: PASSWORD.value, profile_image: this.state.files[0].name, profile: PROFILE.value } });
                                                    this.setState({ isRegisterComplete: true, name: NAME.value });
                                                }}>
                                                    <h1>Register Page</h1>
                                                    <input type="text" placeholder="email" ref={emailValue => { EMAIL = emailValue }}/><br/>
                                                    <input type="password" placeholder="password" ref={passwordValue => { PASSWORD = passwordValue }}/><br/>
                                                    <input type="text" placeholder="name" ref={nameValue => { NAME = nameValue }}/><br/>
                                                    <input type="text" placeholder="profile" ref={profileValue => { PROFILE = profileValue }}/><br/>
                                                    <Dropzone onDrop={this.onDrop}>
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                                <input {...getInputProps()} />
                                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                                            </div>
                                                        )}
                                                    </Dropzone>
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
