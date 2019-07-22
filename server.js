const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./DAO/schema/schema');
const resolvers = require('./DAO/resolver/merge');

const app = express();

app.use(bodyParser.json());

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ 
    app,
    cors: {
        credentials: true,
        origin: true,
    },
    path: "/",
})

const port = process.env.PORT || 5500

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