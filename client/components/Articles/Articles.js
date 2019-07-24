import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Moment from 'react-moment'

import './Articles.css'

export class Articles extends Component {

    render() {
        const GET_ARTICLES = gql`
            query {
                articles {
                    _id
                    title
                    description
                    date
                    writer {
                        name
                    }
                }
            }
        `;

        const DELETE_ARTICLE = gql`
            mutation deleteArticle ($articleId: ID!) {
                deleteArticle(articleId: $articleId) {
                    _id
                    title
                    description
                    date
                    writer {
                        name
                    }
                }
            }
        `

        return (
            <Query query={GET_ARTICLES}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                        <div className="Articles">
                            {data.articles.map(article => (
                                <Mutation 
                                    key={article._id} 
                                    mutation={DELETE_ARTICLE}
                                >
                                    {(deleteArticle, data) => (
                                        <div className="Article">
                                            <h1>{article.title}</h1>
                                            <h2>{article.description}</h2>
                                            <Moment format="LLLL" local>{article.date}</Moment>
                                            <p>{article.writer.name}</p>
                                            <button className="Article__button" onClick={e => {
                                                e.preventDefault();
                                                deleteArticle({ variables: { articleId: article._id } })
                                            }}>
                                                Delete
                                            </button>
                                        </div>
                                    )}                                    
                                </Mutation>
                            ))}
                        </div>                        
                    );
                }}
            </Query>
        )
    }
}



export default Articles
