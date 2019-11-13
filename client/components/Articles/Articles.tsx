import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Moment from 'react-moment'
import Link from 'next/link'

import ArticleImage from './ArticleImage';

function Articles(props: any) {

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
                if (error) {
                    localStorage.clear();
                    props.loginReset(false);
                    return (
                        <div>
                            <p>You need to <Link href="/login">Login</Link> again</p>
                        </div>
                    )
                }

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
                                                <img className="User__profile" src={`https://sjg-bucket-com.s3.amazonaws.com/static/profile/${article.writer.profile_image}`} alt={`${article.writer.name}'s image`}/>
                                                <p className="User__name">{article.writer.name}</p>
                                            </div>
                                            {article.writer.name === localStorage.getItem('userName') ? 
                                            (
                                                <button className="Article__button" onClick={e => {
                                                    e.preventDefault();
                                                    deleteArticle({ variables: { articleId: article._id } })
                                                }}>
                                                    Delete
                                                </button>
                                            ) :
                                            (<p></p>)}
                                            {article.writer.name === localStorage.getItem('userName') ?
                                            (
                                                <Link href="/ArticleRevice">
                                                    <button className="Article__button" onClick={() => {
                                                        localStorage.setItem("articleId", article._id);
                                                    }}>
                                                        Update
                                                    </button>
                                                </Link>
                                            ) :
                                            (<p></p>)}
                                            
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
