import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Navbar from '../components/Navbar/Navbar'
import './CreateArticle.css'

export class CreateArticle extends Component {

    constructor(props) {
        super(props)
        this.titleRef = React.createRef()
        this.descriptionRef = React.createRef()
    }

    // for the test grap the userId on the server side ==> 5d30310e42d0805df0c59a86

    componentDidMount() {
        document.title = "CreateArticle"
    }

    render() {
        const CREATE_ARTICLE = gql `
            mutation createArticle($title: String!, $description: String!){
                createArticle(articleInput: {title: $title, description: $description, writer:"5d30310e42d0805df0c59a86"}) {
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
                <div className="title">
                        <Link href="/"><a>Title</a></Link>
                </div>
                <Navbar />
                <React.Fragment>
                    <Mutation mutation={CREATE_ARTICLE}>
                        {(addArticle, data) => (
                            <div className="contentContainer">
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        addArticle({ 
                                            variables: {
                                                title: this.titleRef.current.value,
                                                description: this.descriptionRef.current.value
                                            } 
                                        });
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
                </React.Fragment>
            </div>
        )
    }
}

export default CreateArticle
