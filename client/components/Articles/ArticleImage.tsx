import React, { Component } from 'react'

import './Articles.css'

type ImageProps = {
    images: [string];
};

export class ArticleImage extends Component<ImageProps> {
    state = {
        images: this.props.images,
        tarNum: 0,
    }
    
    showImage = {
        display: 'block'
    }

    noShowImage = {
        display: 'none'
    }

    render() {
        return (
            <div>
                {
                    this.state.images.map((image, number) => {
                        if(number === this.state.tarNum) {
                            return (
                                <img className="Article__image" key={number} style={ this.showImage } src={`http://localhost:5500/static/article/${image}`} alt={`${image}`}/>
                            )
                        }
                        else {
                            return (
                                <img className="Article__image" key={number} style={ this.noShowImage } src={`http://localhost:5500/static/article/${image}`} alt={`${image}`}/>
                            )
                        }
                    })
                }
                <button className="Article__button" onClick={e => {
                    e.preventDefault();
                    let nextNum = this.state.tarNum + 1;
                    this.setState({ tarNum: nextNum });
                    if(nextNum >= this.state.images.length) {
                        this.setState({ tarNum: 0 });
                    }
                    this.forceUpdate()
                }}>Next</button>
            </div>
        )
    }
}

export default ArticleImage
