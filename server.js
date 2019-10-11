const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { existsSync, mkdirSync } = require('fs') // Checking folder is exist and make folder if folder does not exist.
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('./staticConst'); // Static const for decrypting the jwt token value.

const typeDefs = require('./DAO/schema/schema');
const resolvers = require('./DAO/resolver/merge');

const app = express();

app.use(bodyParser.json());

const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: ({ req, res }) => {
        const authorization = req.headers.authorization || '';
        const token = authorization.split(' ')[1];
        let parsingContext = {
            clientInfo: null
        }
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
                throw error
            }
        }
    } 
});

// If folder does not exist make directory using fs requring.
existsSync(path.join(__dirname, "/static/images")) || mkdirSync(path.join(__dirname, "/static/images"));

// If folder does not exist make directory using fs requring.
existsSync(path.join(__dirname, "/static/article")) || mkdirSync(path.join(__dirname, "/static/article"));

// Order is important for use static file sending.
app.use("/static/images", express.static(path.join(__dirname, "/static/images")));

// Order is important for use static file sending.
app.use("/static/article", express.static(path.join(__dirname, "/static/article")));

server.applyMiddleware({ 
    app,
    cors: {
        credentials: true,
        origin: true,
    },
    // path: "/",
})

const port = process.env.PORT || 5500

app.use(express.static('client/out'));

app.get('*', (req, res) => {
    let fileName = req.path.slice(1);
    if(fileName === 'home') {
        fileName = 'index.html'
    }
    res.sendFile(path.resolve(__dirname, 'client', 'out', fileName));
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_PASSWORD}@post-rdm59.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(
        app.listen(
            port, 
            (req, res) => 
                console.log(`Server is running at http://localhost:${port} and you can use the apollo playground http://localhost:${port}/graphql`)
        )
    )
    .catch(err => console.log(err));

// If use nodemon.json file property. must turn off the nodemon and restart nodemon.