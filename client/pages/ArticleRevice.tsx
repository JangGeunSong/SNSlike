/*
    This part stil developing.
*/
import React, { Component } from 'react'
import Link from 'next/link'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'

import Title from '../components/Title/Title'
import Navbar from '../components/Navbar/Navbar'

interface componentProps {
    files: Array<any>,
    fileNames: Array<any>,
}

export class ArticleRevice extends Component<componentProps> {
    onDrop: any
    state = {
        token: null,
        title: null,
        description: null,
        files: [],
        fileNames: [],
        isEmpty: true,
    }

    constructor(props: any) {
        super(props);
        this.onDrop = (files: any) => {
            if(this.state.isEmpty) this.setState({ isEmpty: !this.state.isEmpty });
            // this.setState((prevState) => ({
            //     files: prevState.files.push(files[0])
            // }))
            // this.setState((prevState):any => ({
            //     fileNames: [...prevState.fileNames, files[0].path]
            // }))
            let filesArray: Array<any> = this.state.files;
            let filesNamesArray: Array<any> = this.state.fileNames;
            console.log(files[0]);
            filesArray.push(files[0]);
            filesNamesArray.push(files[0].path);
            this.setState({ files: filesArray });
            this.setState({ filNames: filesNamesArray });
            console.log(this.state.files);
        }
        this.onTitleHandle = this.onTitleHandle.bind(this);
        this.onDescriptionHandle = this.onDescriptionHandle.bind(this);
    }

    componentDidMount() {
        document.title = 'ArticleRevice';
        if(localStorage.getItem('token') === null) {
            this.setState({ token: null });
        }
        else {
            this.setState({ token: localStorage.getItem('token') });
        }
    }

    onTitleHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ title: e.currentTarget.value });
    }

    onDescriptionHandle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ description: e.currentTarget.value });
    }

    render() {
        const GET_ARTICLESIMGS = gql`
            query {
                articles {
                    images
                }
            }
        `;
        // Querying image names for update image array in DB and storage.

        const ARTICLEUPDATE = gql`
            mutation updateArticle($articleId: ID!, $writer: String!, $title: String!, $description: String!, $images: [Upload], $fileNames: [String]){
                updateArticle(articleId: $articleId, articleInput: {title: $title, description: $description, writer: $writer, images: $images, fileNames: $fileNames}) {
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
                    <Query query={GET_ARTICLESIMGS}>
                        {({ loading, error, data }: any) => {
                            if(loading) return '...Loading'
                            if(error) return `Error! ${error.message}`
                            
                            if(this.state.token) {
                                this.setState({ fileNames: data.images })
                                return (
                                    <Mutation 
                                        mutation={ARTICLEUPDATE}
                                    >
                                        {(articleUpdate: any) => (
                                            <div className="contentContainer">
                                                <form
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        articleUpdate({
                                                            variables: {
                                                                articleId: localStorage.getItem("articleId"),
                                                                title: this.state.title,
                                                                description: this.state.description,
                                                                writer: localStorage.getItem('token'),
                                                                images: this.state.files,
                                                                fileNames: this.state.fileNames,
                                                                // articleId, title, description is need 
                                                            }
                                                        });
                                                        alert("Update article in done please reload page!");
                                                    }}
                                                >
                                                    <div className="form__control">
                                                        <label htmlFor="title">Title </label>
                                                        <input type="text" id="title" placeholder="Type the title" onChange={this.onTitleHandle} />
                                                    </div>
                                                    <div className="form__control">
                                                        <label htmlFor="description">Description</label>
                                                        <textarea id="description" placeholder="Type any contents" onChange={this.onDescriptionHandle} rows={25} cols={120}/>
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
                            }
                            return ((<div className="contentContainer"><h1>You need to</h1> <Link href="/login"><a><h1>Login</h1></a></Link></div>));
                        }}
                    </Query>
                    
                </React.Fragment>
                
            </div>
        )
    }
}

export default ArticleRevice
