import React, { Component } from 'react'
import { Query } from 'react-apollo'
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
        return (
            <Query query={GET_ARTICLES}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                        <div className="Articles">
                            {data.articles.map(article => (
                                <div key={article._id} className="Article">
                                    <h1>{article.title}</h1>
                                    <h2>{article.description}</h2>
                                    <Moment format="YYYY/MM/DD" local>{article.date}</Moment>
                                    <p>{article.writer.name}</p>
                                </div>
                            ))}
                        </div>                        
                    );
                }}
            </Query>
        )
    }
}



export default Articles
