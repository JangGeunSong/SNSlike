import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Moment from 'react-moment'

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
    ` 

    const articleImageShowing = (articleImages) => {
        return articleImages
    }

    return (
        <Query query={GET_ARTICLES}>
            {({ loading, error, data }) => {
                if (loading) return 'Loading...';
                if (error) return `Error! ${error.message}`;

                let resultArticle = data.articles;

                return (
                    <div className="Articles">
                        {resultArticle.map(article => {
                            let isImageEmpty = true;
                            let articleImage = <p></p>;
                            let recentIndex = 0;
                            let imageNumber = 0;
                            const showStyle = {display: 'block'}  
                            const noShowStyle = {display: 'none'}  
                            if(article.images === null) {
                                isImageEmpty = true;
                            }
                            else {
                                isImageEmpty = false;
                                imageNumber = article.images.length;
                                articleImage = article.images.map((image, number)=> {
                                    if(number === 0) {
                                        return (
                                            <img className="Article__image" key={number} style={showStyle} src={`http://localhost:5500/static/article/${image}`} alt={`${image}`}/>
                                        )
                                    }
                                    else {
                                        return (
                                            <img className="Article__image" key={number} style={noShowStyle} src={`http://localhost:5500/static/article/${image}`} alt={`${image}`}/>
                                        )
                                    }
                                })
                            }
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
                                    {deleteArticle => (
                                        <div className="Article">
                                            <div className="Article__contents">
                                                <h1>{article.title}</h1>
                                                {isImageEmpty ? 
                                                (<p></p>)
                                                :
                                                (
                                                    <div className="Article__imageCage">
                                                        {articleImage}
                                                    </div>
                                                )
                                                }
                                                <button className="Article__button" onClick={e => {
                                                    e.preventDefault();
                                                    const prevNum = recentIndex;
                                                    recentIndex++;
                                                    if(recentIndex > imageNumber) {
                                                        recentIndex = 0;
                                                    }
                                                    articleImage = article.images.map((image, number)=> {
                                                        if(number === recentIndex) {
                                                            return (
                                                                <img className="Article__image" key={number} style={showStyle} src={`http://localhost:5500/static/article/${image}`} alt={`${image}`}/>
                                                            )
                                                        }
                                                        else if(number === prevNum) {
                                                            return (
                                                                <img className="Article__image" key={number} style={noShowStyle} src={`http://localhost:5500/static/article/${image}`} alt={`${image}`}/>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <img className="Article__image" key={number} style={noShowStyle} src={`http://localhost:5500/static/article/${image}`} alt={`${image}`}/>
                                                            )
                                                        }
                                                    })
                                                }}>next</button>
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
