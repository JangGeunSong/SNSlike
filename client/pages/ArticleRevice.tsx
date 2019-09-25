/*
    This part stil developing.
*/
import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar'

export class ArticleRevice extends Component {
    state = {
        token: null,
        title: null,
        description: null,
    }

    componentDidMount() {
        document.title = 'ArticleRevice';
        if(localStorage.getItem('token') === null) {
            this.setState({ token: null });
        }
        else {
            this.setState({ token: localStorage.getItem('token') });
        }
    }

    onTitleHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ title: e.currentTarget.value });
    }

    onDescriptionHandle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ description: e.currentTarget.value });
    }

    render() {
        const ARTICLEUPDATE = gql`
            mutation updateArticle($articleId: ID!, $writer: String!, $title: String!, $description: String!){
                updateArticle(articleId: $articleId, articleInput: {title: $title, description: $description, writer: $writer}) {
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
                    {this.state.token ? 
                    (
                        <Mutation 
                            mutation={ARTICLEUPDATE}
                        >
                            {(articleUpdate: any) => (
                                <div className="contentContainer">
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            articleUpdate({
                                                variables: {
                                                    articleId: localStorage.getItem("articleId"),
                                                    title: this.state.title,
                                                    description: this.state.description,
                                                    writer: localStorage.getItem('token'),
                                                    // articleId, title, description is need 
                                                }
                                            });
                                            alert("Update article in done please reload page!");
                                        }}
                                    >
                                        <div className="form__control">
                                            <label htmlFor="title">Title </label>
                                            <input type="text" id="title" placeholder="Type the title" onChange={this.onTitleHandle} />
                                        </div>
                                        <div className="form__control">
                                            <label htmlFor="description">Description</label>
                                            <textarea id="description" placeholder="Type any contents" onChange={this.onDescriptionHandle} rows={25} cols={120}/>
                                        </div>
                                        <button className="form__button" type="submit">Submit</button>
                                    </form>
                                </div>
                            )}
                        </Mutation>
                    )
                    :
                    ((<div className="contentContainer"><h1>You need to</h1> <Link href="/login"><a><h1>Login</h1></a></Link></div>))
                    }
                </React.Fragment>
                
            </div>
        )
    }
}

export default ArticleRevice
