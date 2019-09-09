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
        userId: null,
        articleId: null,
    }

    componentDidMount() {
        document.title = 'ArticleRevice';
        if(localStorage.getItem('userId') === null) {
            this.setState({ userId: null });
        }
        else {
            this.setState({ userId: localStorage.getItem('userId') });
        }
    }

    render() {
        const ARTICLEUPDATE = gql`
            mutation updateArticle($articleId: ID!, $title: string!, $description: string!){
                updateArticle(articleId: $articleId, articleInput: {title: $title, description: $description})
            } {
                _id
                title
                date
                description
                writer {
                    _id
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
                            mutation={ARTICLEUPDATE}
                        >
                            {(articleUpdate: any) => (
                                <div className="contentContainer">
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            articleUpdate({
                                                variables: {
                                                    // articleId, title, description is need 
                                                }
                                            })
                                        }}
                                    >

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
