import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar';

class register extends Component {
    onDrop: any;
    state = {
        isRegisterComplete: false,
        name: null,
        files: [],
    }

    constructor(props: any) {
        super(props);
        this.onDrop = (files: any) => {
            this.setState({files})
        }
    }

    componentDidMount() {
        document.title = "Register"
    }

    render() {

        const CREATE_USER = gql `
            mutation createUser($name: String!, $email: String!, $password: String!, $profile_image: Upload, $profile: String) {
                createUser(userInput: { name: $name, email: $email, password: $password, profile_image: $profile_image, profile: $profile }) {
                    _id
                }
            }
        `

        let NAME: string, EMAIL: string, PASSWORD: string, PROFILE: string;
        
        let fileList: any = <p></p>;
        
        if(this.state.files !== null) {
            fileList = this.state.files.map( (file: any) => (
                <li key={file.path}>
                    {file.path} - {file.size} bytes
                </li>
            ))
        }

        return (
            <div>
                <Title />
                <Navbar />
                <div className="contentContainer">
                    <ApolloConsumer>
                        {() => (
                            <Mutation
                                mutation={CREATE_USER}
                                onCompleted={() => {
                                    this.setState({ isRegisterComplete: true });
                                }}
                            >
                                {(createuser: any, { loading, error }: any) => {
                                    if(loading) return <p>Loading...</p>
                                    if(error) {
                                        const errorMessage = error.graphQLErrors.map(({ message }: any, number: any) => (
                                            <span key={number}>{message}</span>
                                        ))
                                        return (
                                            <div>
                                                {errorMessage}
                                            </div>
                                        )
                                    }

                                    if(this.state.isRegisterComplete) return (
                                        <div>
                                            <h1>create {this.state.name} is complete!</h1>
                                            <p>Please login</p>
                                            <Link href="/login"><a>Here</a></Link>
                                        </div>
                                    )

                                    return (
                                        <form className="form__control" onSubmit={e => {
                                            e.preventDefault();
                                            console.log(this.state.files[0]);
                                            createuser({ variables: { 
                                                name: NAME, 
                                                email: EMAIL, 
                                                password: PASSWORD, 
                                                profile_image: this.state.files[0], 
                                                profile: PROFILE 
                                            } });
                                            this.setState({ isRegisterComplete: true, name: NAME });
                                        }}>
                                            <h1>Register Page</h1>
                                            <input type="text" placeholder="email" ref={emailValue => { 
                                                EMAIL = '';
                                                if(emailValue !== null) {
                                                    EMAIL = emailValue.value;
                                                }
                                            }}/><br/>
                                            <input type="password" placeholder="password" ref={passwordValue => { 
                                                PASSWORD = '';
                                                if(passwordValue !== null) {
                                                    PASSWORD = passwordValue.value; 
                                                }
                                            }}/><br/>
                                            <input type="text" placeholder="name" ref={nameValue => { 
                                                NAME = '';
                                                if(nameValue !== null) {
                                                    NAME = nameValue.value;
                                                } 
                                            }}/><br/>
                                            <input type="text" placeholder="profile" ref={profileValue => { 
                                                PROFILE = '';
                                                if(profileValue !== null) {
                                                    PROFILE = profileValue.value;
                                                }
                                            }}/><br/>
                                            <Dropzone onDrop={this.onDrop}>
                                                {({ getRootProps, getInputProps, isDragActive }) => (
                                                    <div {...getRootProps({ className: 'dropzone' })}>
                                                        <input {...getInputProps()} />
                                                        {isDragActive ? 
                                                            (<p>File is on the page!</p>)
                                                            :
                                                            (<p>Drag 'n' drop some files here, or click to select files</p>)
                                                        }
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <button className="form__button">Submit</button><br/>
                                            <aside>
                                                {fileList}
                                            </aside>
                                        </form>
                                    )
                                }}
                            </Mutation>
                        )}
                    </ApolloConsumer>
                </div>
            </div>
        )
    }
}

export default register
