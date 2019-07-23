import React, { Component } from 'react'
import Link from 'next/link'

import Navbar from '../components/Navbar/Navbar'
import './CreateArticle.css'

export class CreateArticle extends Component {

    constructor(props) {
        super(props)
        this.titleRef = React.createRef()
        this.descriptionRef = React.createRef()
    }

    // for the test grap the userId on the server side ==> 5d30310e42d0805df0c59a86

    render() {
        return (
            <div>
                <div className="title">
                        <Link href="/">Title</Link>
                    </div>
                    <Navbar />
                    <React.Fragment>
                        <div className="contentContainer">
                            <form>
                                <div className="form__control">
                                    <label htmlFor="title">Title </label>
                                    <input type="text" id="title" ref={this.titleRef}/>
                                </div>
                                <div className="form__control">
                                    <label htmlFor="description">Description</label>
                                    <textarea id="description" ref={this.descriptionRef} rows="25" cols="120"/>
                                </div>
                            </form>
                        </div>
                    </React.Fragment>
            </div>
        )
    }
}

export default CreateArticle
