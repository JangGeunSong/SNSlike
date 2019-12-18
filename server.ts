import express, { Request, Response } from 'express'
// const express = require('express'); 
// 기존의 js 파일에서는 express 서버를 부를떄 주석 처리한 부분과 같이 사용해야 하지만 typescript에서는 es6를 사용하도록 허가했으므로 위처럼 사용한다.
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
// const { existsSync, mkdirSync } = require('fs') // Checking folder is exist and make folder if folder does not exist. -> No more needs

import jwt from 'jsonwebtoken'
import { SECRET_KEY } from './staticConst'
// Static const for decrypting the jwt token value.

import typeDefs from './DAO/schema/schema'
import resolvers from './DAO/resolver/merge'

const app = express();

app.use(bodyParser.json());

const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: ({ req, res }) => {
        const authorization = req.headers.authorization || '';
        const token = authorization.split(' ')[1];

        let parsingContext = {  }
        if(token === 'null') {
            return { res, parsingContext };
        }
        else {
            try {
                const clientInfo = jwt.verify(token, SECRET_KEY);
                parsingContext = {
                    clientInfo
                }
                return { res, parsingContext };
            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        }
    } 
});

/*
    No more needs static folder. Because I use aws s3 service for rendering client side app by sending static images

    // If folder does not exist make directory using fs requring.
    existsSync(path.join(__dirname, "/static/images")) || mkdirSync(path.join(__dirname, "/static/images"));

    // If folder does not exist make directory using fs requring.
    existsSync(path.join(__dirname, "/static/article")) || mkdirSync(path.join(__dirname, "/static/article"));

    // Order is important for use static file sending.
    app.use("/static/images", express.static(path.join(__dirname, "/static/images")));

    // Order is important for use static file sending.
    app.use("/static/article", express.static(path.join(__dirname, "/static/article")));
*/

server.applyMiddleware({ 
    app,
    cors: {
        credentials: true,
        origin: true,
    },
    // path: "/",
})

const port = process.env.PORT || 5500

app.use(express.static('public'));

app.get('*', (req: Request, res: Response) => {
    let fileName = req.path.slice(1);
    if(fileName === 'home') {
        fileName = 'index.html'
    }
    res.sendFile(path.resolve(__dirname, 'public', fileName+'.html'));
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_PASSWORD}@post-rdm59.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => // 에러 처리를 위해 then 이후 콜백 함수 호출로 처리한다.
        app.listen(
            port, 
            () => 
                console.log(`Server is running at http://localhost:${port} and you can use the apollo playground http://localhost:${port}/graphql`)
        )
    )
    .catch((err: any) => console.log(err));

// If use nodemon.json file property. must turn off the nodemon and restart nodemon.