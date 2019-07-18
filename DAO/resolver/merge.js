const articleResolver = require('./article');
const userResolver = require('./user');

const resolver = {
    Query: {
        ...articleResolver.Query,
        ...userResolver.Query,
    },
    Mutation: {
        ...articleResolver.Mutation,
        ...userResolver.Mutation,
    }
}

module.exports = resolver;