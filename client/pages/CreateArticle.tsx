import React, { Component } from 'react'
import Link from 'next/link'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'

import './pageStyle.css'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar'

export class CreateArticle extends Component {
    titleRef: React.RefObject<HTMLInputElement>;
    descriptionRef: React.RefObject<HTMLTextAreaElement>;
    onDrop: any
    state = {
        userId: null,
        files: [],
        fileNames: [],
        isEmpty: true,
    }

    constructor(props: any) {
        super(props)
        this.titleRef = React.createRef()
        this.descriptionRef = React.createRef()
        this.onDrop = (files:any) => {
            if(this.state.isEmpty) this.setState({ isEmpty: !this.state.isEmpty });
            // this.setState(prevState => ({
            //     files: [...prevState.files, files[0]]
            // }))
            // this.setState(prevState => ({
            //     fileNames: [...prevState.fileNames, files[0].path]
            // }))
            this.setState({ files: [files] });
            this.setState({ filNames: [files.path] });
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
            mutation createArticle($title: String!, $description: String!, $writer: String!, $images: [Upload], $fileNames: [String]){
                createArticle(articleInput: {title: $title, description: $description, writer: $writer, images: $images, fileNames: $fileNames}) {
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
        const fileList = this.state.files.map( (file:any) => (
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
                            {(addArticle:any) => (
                                <div className="contentContainer">
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            addArticle({ 
                                                variables: {
                                                    title: this.titleRef.current,
                                                    description: this.descriptionRef.current,
                                                    writer: this.state.userId,
                                                    images: this.state.files,
                                                    fileNames: this.state.fileNames,
                                                } 
                                            });
                                        }}
                                    >
                                        <div className="form__control">
                                            <label htmlFor="title">Title </label>
                                            <input type="text" id="title" placeholder="Type the title" ref={this.titleRef}/>
                                        </div>
                                        <div className="form__control">
                                            <label htmlFor="description">Description</label>
                                            <textarea id="description" placeholder="Type any contents" ref={this.descriptionRef} rows={25} cols={120}/>
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
                                    {this.state.isEmpty ? 
                                    (
                                        <p>Please upload your picture!</p>
                                    )
                                    :
                                    (
                                        <aside>
                                            {fileList}
                                        </aside>
                                    )
                                    }
                                    
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
