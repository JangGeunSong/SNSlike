import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar';

export class userPage extends Component {

    state = {
        isLoggedIn: false,
    }

    componentDidMount() {
        document.title = 'User Page'
        if(localStorage.getItem('token') === null) {
            this.setState({ isLoggedIn: false });
        }
        else {
            this.setState({ isLoggedIn: true });
        }
    }

    render() {
        const UPDATE_USER = gql`
            mutation updateUser($userId: ID!, $name: String!, $email: String!, $password: String!, $profile_image: Upload, $profile: String){
                updateUser(userId: $userId, userInput: {name: $name, email: $email, password: $password, profile_image: $profile_image, profile: $profile}) {
                    _id
                    name
                }
            }
        `
        return (
            <div>
                <Title />
                <Navbar />
                <React.Fragment>
                    <Mutation 
                        mutation={UPDATE_USER}
                        onCompleted={({ updateUser }) => {
                            localStorage.setItem('userName', updateUser.name);
                        }}
                    >
                        {(updateUser, { loading, error }) => {
                                    if(loading) return <p>Loading...</p>
                                    if(error) {
                                        const errorMessage = error.graphQLErrors.map(({ message }, number) => (
                                            <span key={number}>{message}</span>
                                        ))
                                        return (
                                            <div>
                                                {errorMessage}
                                            </div>
                                        )
                                    }

                                    let EMAIL
                                    let PASSWORD;
                                    let PROFILE;
                                    let NAME;

                                    return (
                                        <div className="contentContainer">
                                            <form className="form__control" onSubmit={e => {
                                                e.preventDefault();
                                                updateUser({ variables: { 
                                                    userId: localStorage.getItem('userId'),
                                                    name: NAME.value, 
                                                    email: EMAIL.value, 
                                                    password: PASSWORD.value, 
                                                    profile: PROFILE.value 
                                                } });
                                            }}>
                                                <h1>Update User</h1>
                                                <p>Change your account details.</p><br></br>
                                                <input type="text" placeholder="email" ref={emailValue => { EMAIL = emailValue }}/><br/>
                                                <input type="password" placeholder="password" ref={passwordValue => { PASSWORD = passwordValue }}/><br/>
                                                <input type="text" placeholder="name" ref={nameValue => { NAME = nameValue }}/><br/>
                                                <input type="text" placeholder="profile" ref={profileValue => { PROFILE = profileValue }}/><br/>
                                            </form>
                                        </div>
                                    )
                                }}
                    </Mutation>
                </React.Fragment>
                <div className="contentContainer">
                    
                </div>
            </div>
        )
    }
}

export default userPage
