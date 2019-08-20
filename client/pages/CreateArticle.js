import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar'

export class CreateArticle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userId: null
        }
        this.titleRef = React.createRef()
        this.descriptionRef = React.createRef()
    }

    componentDidMount() {
        document.title = "CreateArticle"
        if(localStorage.getItem('userId') === null) {
            this.setState({ userId: null });
        }
        else {
            this.setState({ userId: localStorage.getItem('userId') })
        }
    }

    render() {
        const CREATE_ARTICLE = gql `
            mutation createArticle($title: String!, $description: String!, $writer: String!){
                createArticle(articleInput: {title: $title, description: $description, writer: $writer}) {
                    _id
                    title
                    date
                    description
                    writer {
                    _id
                    }
                }
            }
        `   

        return (
            <div>
                <Title />
                <Navbar />
                <React.Fragment>
                    {this.state.userId ?
                    (
                        <Mutation 
                            mutation={CREATE_ARTICLE}
                        >
                            {(addArticle, data) => (
                                <div className="contentContainer">
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            addArticle({ 
                                                variables: {
                                                    title: this.titleRef.current.value,
                                                    description: this.descriptionRef.current.value,
                                                    writer: this.state.userId
                                                } 
                                            });
                                            console.log(e.target);
                                            window.location.reload();
                                        }}
                                    >
                                        <div className="form__control">
                                            <label htmlFor="title">Title </label>
                                            <input type="text" id="title" placeholder="Type the title" ref={this.titleRef}/>
                                        </div>
                                        <div className="form__control">
                                            <label htmlFor="description">Description</label>
                                            <textarea id="description" placeholder="Type any contents" ref={this.descriptionRef} rows="25" cols="120"/>
                                        </div>
                                        <button className="form__button" type="submit">Submit</button>
                                    </form>
                                </div>
                            )}
                        </Mutation>
                    )
                    :
                    (<div className="contentContainer"><h1>You need to</h1> <Link href="/login"><a><h1>Login</h1></a></Link></div>)
                    }
                    
                </React.Fragment>
            </div>
        )
    }
}

export default CreateArticle
