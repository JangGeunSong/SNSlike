const Article = require('../../model/Article');
const User = require('../../model/User');
const { createWriteStream } = require('fs');
const path = require('path');

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
            // const articleImages = await args.articleInput.images;
            let article = new Article({
                title: args.articleInput.title,
                description: args.articleInput.description,
                date: new Date().toISOString(),
                writer: args.articleInput.writer,
                // images: args.articleInput.images.filename,
            });
            // Don't need the _id field because it will create automatically by mongodb
            let createdArticle;
            try {
                const result = await article.save();
                createdArticle = {
                    ...result._doc, 
                    _id: result.id, 
                    date: new Date(result._doc.date).toISOString(),
                    writer: result._doc.writer,
                    // images: result._doc.images,
                };
                // articleImages.map((createReadStream, filename, mimetype, encoding) => {
                //     await createReadStream()
                //         .pipe(createWriteStream(path.join(__dirname, `../../static/article`, filename)));
                // });
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
        deleteArticle: async (request, args) => {
            const articleId = args.articleId;
            let targetArticle;
            try {
                const result = await Article.findById(articleId).populate('article');
                await Article.deleteOne({ _id: articleId });
                const writer = await User.findById(result._doc.writer);
                // if(!writer) {
                //     throw new Error('Creator not found!');
                // }
                targetArticle = {
                    ...result._doc,
                    _id: result._id,
                    title: result._doc.title,
                    description: result._doc.description,                    
                    date: new Date(result._doc.date).toISOString(),
                    writer: writer,
                }
                return targetArticle;
            } 
            catch (err) {
                throw err
            }
        }
    },
}