const Article = require('../../model/Article');
const User = require('../../model/User');

const s3 = require('../../s3')

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
            console.log(context.parsingContext);
            let article = new Article({
                title: args.articleInput.title,
                description: args.articleInput.description,
                date: new Date().toISOString(),
                writer: context.parsingContext.clientInfo.userId,
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
                            let uploadParam = {
                                Bucket: 'sjg-bucket-com', 
                                Key: 'static/articleimgs/' + filename, 
                                Body: createReadStream()
                            }
                            s3.upload(uploadParam)
                                .on("httpUploadProgress", evt => {

                                })
                                .send((err, data) => {
                                    if(err) {
                                        throw err;
                                    }
                                    console.log(data);
                                })
                            // createReadStream()
                            //     .pipe(createWriteStream(path.join(__dirname, '../../static/article', filename)))
                        })
                        .catch(err => console.log(err))
                });
                const writer = await User.findById(context.parsingContext.clientInfo.userId);
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
            let creatorsArticle;
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
                creatorsArticle = await writer.created_articles.filter(el => el !== articleId);
                await writer.updateOne({ _id: result._doc.writer }, { $set: { created_articles: creatorsArticle } });
                // Update writer's created article. This process delete article Id on this target article.
                if(images !== null) {
                    images.map((image) => {
                        try {
                            let deleteParam = {
                                Bucket: 'sjg-bucket-com', 
                                Key: 'static/articleimgs/' + image, 
                            }
                            s3.deleteObject(deleteParam, (err, data) => {
                                if(err) {
                                    throw err;
                                }
                                console.log(data);
                            })
                            // unlinkSync(path.join(__dirname, `../../static/article`, image))
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
            const userId = context.parsingContext.clientInfo.userId;
            const articleOwner = await Article.findById(articleId).populate('article');
            const articleImages = await args.articleInput.images;
            if(userId === articleOwner._doc.writer.toString()) {
                /* Stored image process ==> 
                    1. If image name exist in DB & sending message, doed not be executed any action or method.
                    2. If image name 'just' exist in DB, that should be removed.
                    3. If image name 'just' exist in input data as a promise, that save in storage as a new image file.
                */
               try {
                    articleOwner._doc.images.map((image) => {
                        let deleteParam = {
                            Bucket: 'sjg-bucket-com', 
                            Key: 'static/articleimgs/' + image, 
                        }
                        s3.deleteObject(deleteParam, (err, data) => {
                            if(err) {
                                throw err;
                            }
                            console.log(data);
                        })
                        // unlink(path.join(__dirname, '../../static/article', image))
                    })
                    // Delete all files in the article and save all files in storage
                    articleOwner._doc.images = [];
                    // Is it necessary?
                    articleImages.map((image) => {
                        image
                            .then(({ filename, mimetype, encoding, createReadStream }) => {
                                if(!articleOwner._doc.images.includes(filename)) { // it's better to use 'includes' method
                                    let uploadParam = {
                                        Bucket: 'sjg-bucket-com', 
                                        Key: 'static/articleimgs/' + filename, 
                                        Body: createReadStream()
                                    }
                                    s3.upload(uploadParam)
                                        .on("httpUploadProgress", evt => {
        
                                        })
                                        .send((err, data) => {
                                            if(err) {
                                                throw err;
                                            }
                                            console.log(data);
                                        })
                                    // createReadStream()
                                    //     .pipe(createWriteStream(path.join(__dirname, '../../static/article', filename)))
                                }
                            })
                            .catch(err => console.log(err))
                    });
                    const updateContent = {
                        title: args.articleInput.title,
                        description: args.articleInput.description,
                        images: args.articleInput.filenames,                    
                        date: new Date().toISOString()
                    }
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