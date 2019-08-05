const articleResolver = require('./article');
const userResolver = require('./user');
const fileResolver = require('./files');

const resolver = {
    Query: {
        ...articleResolver.Query,
        ...userResolver.Query,
        ...fileResolver.Query,
    },
    Mutation: {
        ...articleResolver.Mutation,
        ...userResolver.Mutation,
        ...fileResolver.Mutation,
    }
}

module.exports = resolver;