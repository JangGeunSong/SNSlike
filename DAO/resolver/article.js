const Article = require('../../model/Article');
const User = require('../../model/User');

async function findtargetUser (userId) {
    return await User.findById(userId);
}

module.exports = {
    Query: {
        articles: async () => {
            try {
                const articles = await Article.find();
                return articles.map(article => {
                    return {
                        _id: article._id,
                        title: article.title,
                        writer: findtargetUser(article.writer),
                        date: new Date(article.date).toISOString(),
                        description: article.description
                    };
                }); 
            } 
            catch (error) {
              throw error;  
            }
        }
    },
    Mutation: {
        // create Article method
        createArticle: async (request, args) => {
            let article = new Article({
                title: args.articleInput.title,
                description: args.articleInput.description,
                date: new Date().toISOString(),
                writer: args.articleInput.writer
            });
            // Don't need the _id field because it will create automatically by mongodb
            let createdArticle;
            try {
                const result = await article.save();
                createdArticle = {
                    ...result._doc, 
                    _id: result.id, 
                    date: new Date(result._doc.date).toISOString(),
                    writer: result._doc.writer
                };
                const writer = await User.findById(args.articleInput.writer);
                if(!writer) {
                    throw new Error('User not found!')
                }
                writer.created_articles.push(article);
                await writer.save();
                return createdArticle;
            } 
            catch (err) {
                throw err;
            }
        },
    },
}