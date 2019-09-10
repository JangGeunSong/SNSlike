import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Moment from 'react-moment'
import Link from 'next/link'

import ArticleImage from './ArticleImage';

import './Articles.css'

function Articles() {

    const GET_ARTICLES = gql`
        query {
            articles {
                _id
                title
                description
                date,
                images,
                writer {
                    name
                    profile_image
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
                    profile_image
                }
            }
        }
    ` ;

    return (
        <Query query={GET_ARTICLES}>
            {({ loading, error, data }: any) => {
                if (loading) return 'Loading...';
                if (error) return `Error! ${error.message}`;

                let resultArticle = data.articles;
                resultArticle.sort((a: any, b: any) => {
                    let aTime = new Date(a.date);
                    let bTime = new Date(b.date);
                    return +bTime - +aTime;
                }) // Sort New to Old article.

                return (
                    <div className="Articles">
                        {resultArticle.map((article: any) => {
                            return (
                                <Mutation 
                                    key={article._id} 
                                    mutation={DELETE_ARTICLE}
                                    refetchQueries={() => {
                                        console.log("Refetch Query run");
                                        return [
                                            {
                                                query: GET_ARTICLES,
                                                variables: resultArticle
                                            }
                                        ]
                                    }}
                                >
                                    {(deleteArticle: any) => (
                                        <div className="Article">
                                            <div className="Article__contents">
                                                <h1>{article.title}</h1>
                                                <ArticleImage images={article.images}/>
                                                <h2>{article.description}</h2>
                                                <Moment format="LLLL" local>{article.date}</Moment>
                                            </div>
                                            <div className="User__container">
                                                <img className="User__profile" src={`http://localhost:5500/static/images/${article.writer.profile_image}`} alt={`${article.writer.name}'s image`}/>
                                                <p className="User__name">{article.writer.name}</p>
                                            </div>
                                            <button className="Article__button" onClick={e => {
                                                e.preventDefault();
                                                deleteArticle({ variables: { articleId: article._id } })
                                            }}>
                                                Delete
                                            </button>
                                            <Link href="/ArticleRevice">
                                                <button className="Article__button" onClick={() => {
                                                    localStorage.setItem("articleId", article._id);
                                                }}>
                                                    <a>Update</a>
                                                </button>
                                            </Link>
                                        </div>
                                    )}                                    
                                </Mutation>
                            )
                        })}
                    </div>                        
                );
            }}
        </Query>
    )
}

export default Articles
