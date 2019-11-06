import React, { Component } from 'react'

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

    onClickNextImage = (e: any) => {
        e.preventDefault();
        let nextNum = this.state.tarNum + 1;
        this.setState({ tarNum: nextNum });
        if(nextNum >= this.state.images.length) {
            this.setState({ tarNum: 0 });
        }
        this.forceUpdate()
    }

    render() {
        return (
            <div>
                {
                    this.state.images.map((image, number) => {
                        if(number === this.state.tarNum) {
                            return (
                                <img className="Article__image" key={number} style={ this.showImage } src={`https://sjg-bucket-com.s3.amazonaws.com/static/articleimgs/${image}`} alt={`${image}`}/>
                            )
                        }
                        else {
                            return (
                                <img className="Article__image" key={number} style={ this.noShowImage } src={`https://sjg-bucket-com.s3.amazonaws.com/static/articleimgs/${image}`} alt={`${image}`}/>
                            )
                        }
                    })
                }
                {this.state.images.length === 1 ? 
                    (<p></p>) :
                    (<button className="Article__button" onClick={this.onClickNextImage}>Next</button>)
                }
                
            </div>
        )
    }
}

export default ArticleImage
