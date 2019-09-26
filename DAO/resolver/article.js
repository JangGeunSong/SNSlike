const Article = require('../../model/Article');
const User = require('../../model/User');
const { createWriteStream, unlinkSync } = require('fs');
const path = require('path');

async function findtargetUser (userId) {
    const user = await User.findById(userId);
    const selectedUserData = {
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
        profile: user.profile,
        created_articles: user.created_articles,
    };
    // Don't want to send the writer ID to the client side.
    return selectedUserData;
}

module.exports = {
    Query: {
        articles: async (object, args, context) => {
            try {
                const articles = await Article.find();
                return articles.map(article => {
                    return {
                        _id: article._id,
                        title: article.title,
                        writer: findtargetUser(article.writer),
                        date: new Date(article.date).toISOString(),
                        description: article.description,
                        images: article.images,
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
        createArticle: async (object, args, context) => {
            const articleImages = await args.articleInput.images;
            const filenames = await args.articleInput.fileNames;
            console.log(filenames);
            let article = new Article({
                title: args.articleInput.title,
                description: args.articleInput.description,
                date: new Date().toISOString(),
                writer: context.clientInfo.userId,
                images: filenames,
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
                    images: result._doc.images,
                };
                articleImages.map((image) => {
                    image
                        .then(({ filename, mimetype, encoding, createReadStream }) => {
                            createReadStream()
                                .pipe(createWriteStream(path.join(__dirname, '../../static/article', filename)))
                        })
                        .catch(err => console.log(err))
                });
                const writer = await User.findById(context.clientInfo.userId);
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
        // delete article
        deleteArticle: async (object, args, context) => {
            const articleId = args.articleId;
            let targetArticle;
            try {
                const result = await Article.findById(articleId).populate('article');
                await Article.deleteOne({ _id: articleId });
                const writer = await User.findById(result._doc.writer);
                // if(!writer) {
                //     throw new Error('Creator not found!');
                // }
                const images = result._doc.images;
                targetArticle = {
                    ...result._doc,
                    _id: result._id,
                    title: result._doc.title,
                    description: result._doc.description,                    
                    date: new Date(result._doc.date).toISOString(),
                    writer: writer,
                }
                await writer.created_articles.filter(el => el !== articleId);
                await writer.save();
                if(images !== null) {
                    images.map((image) => {
                        try {
                            unlinkSync(path.join(__dirname, `../../static/article`, image))
                        } catch (error) {
                            throw error
                        }
                    })
                }
                return targetArticle;
            } 
            catch (err) {
                throw err
            }
        },
        // update article
        updateArticle: async (object, args, context) => {
            const articleId = args.articleId;
            const userId = context.clientInfo.userId;
            const articleOwner = await Article.findById(articleId).populate('article');
            if(userId === articleOwner._doc.writer.toString()) {
                const updateContent = {
                    title: args.articleInput.title,
                    description: args.articleInput.description,                    
                    date: new Date().toISOString()
                }
                try {
                    Article.findByIdAndUpdate(articleId, updateContent, { new: true }, (error) => {
                        if(error) {
                            throw error;
                        }
                    });
                    const result = await Article.findById(articleId).populate('article');
                    return result;
                } 
                catch (error) {
                    throw error    
                }
            }
            else {
                return new Error("Access User is not the Article Owner!");
            }
        }
    },
}