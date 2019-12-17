import articleResolver from './article'
import userResolver from './user'
// const articleResolver = require('./article');
// const userResolver = require('./user');

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

export default resolver;