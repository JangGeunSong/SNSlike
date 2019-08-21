import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar'

export class CreateArticle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userId: null,
            files: [],
        }
        this.titleRef = React.createRef()
        this.descriptionRef = React.createRef()
        this.onDrop = (files) => {
            this.setState(prevState => ({
                files: [...prevState.files, files[0]]
            }))
            console.log(this.state.files);
        }
    }

    componentDidMount() {
        document.title = "CreateArticle"
        if(localStorage.getItem('userId') === null) {
            this.setState({ userId: null });
        }
        else {
            this.setState({ userId: localStorage.getItem('userId') })
        }
    }

    render() {
        const CREATE_ARTICLE = gql `
            mutation createArticle($title: String!, $description: String!, $writer: String!){
                createArticle(articleInput: {title: $title, description: $description, writer: $writer}) {
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

        const fileList = this.state.files.map( (file) => (
            <li key={file.path}>
                {file.path} - {file.size} bytes
            </li>
        ))

        return (
            <div>
                <Title />
                <Navbar />
                <React.Fragment>
                    {this.state.userId ?
                    (
                        <Mutation 
                            mutation={CREATE_ARTICLE}
                        >
                            {(addArticle, data) => (
                                <div className="contentContainer">
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            addArticle({ 
                                                variables: {
                                                    title: this.titleRef.current.value,
                                                    description: this.descriptionRef.current.value,
                                                    writer: this.state.userId
                                                } 
                                            });
                                            console.log(e.target);
                                            window.location.reload();
                                        }}
                                    >
                                        <div className="form__control">
                                            <label htmlFor="title">Title </label>
                                            <input type="text" id="title" placeholder="Type the title" ref={this.titleRef}/>
                                        </div>
                                        <div className="form__control">
                                            <label htmlFor="description">Description</label>
                                            <textarea id="description" placeholder="Type any contents" ref={this.descriptionRef} rows="25" cols="120"/>
                                        </div>
                                        <Dropzone onDrop={this.onDrop}>
                                            {({ getRootProps, getInputProps, isDragActive }) => (
                                                <div {...getRootProps({ className: 'dropzone' })}>
                                                    <input {...getInputProps()} />
                                                    {isDragActive ? 
                                                        (<p>File is on the page!</p>)
                                                        :
                                                        (<p>Drag 'n' drop some files here, or click to select files</p>)
                                                    }
                                                </div>
                                            )}
                                        </Dropzone>
                                        <button className="form__button" type="submit">Submit</button>
                                    </form>
                                    <aside>
                                        {fileList}
                                    </aside>
                                </div>
                            )}
                        </Mutation>
                    )
                    :
                    (<div className="contentContainer"><h1>You need to</h1> <Link href="/login"><a><h1>Login</h1></a></Link></div>)
                    }
                    
                </React.Fragment>
            </div>
        )
    }
}

export default CreateArticle
