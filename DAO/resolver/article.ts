import Article, { IArticle } from '../../model/Article'
// const Article = require('../../model/Article');
import User, { IUser } from '../../model/User'
// const User = require('../../model/User');

import s3 from '../../s3'
// const s3 = require('../../s3')

async function findtargetUser (userId: string) {
    const user = await User.findById(userId);
    if(user !== null) {
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
    else return null
}

export default {
    Query: {
        articles: async (object: any, args: any, context: any) => {
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
        createArticle: async (object: any, args: any, context: any) => {
            const articleImages = await args.articleInput.images;
            console.log(articleImages)
            const filenames = await args.articleInput.fileNames;
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
                articleImages.map((image: any) => {
                    image
                        .then(({ filename, mimetype, encoding, createReadStream }: any) => {
                            let uploadParam = {
                                Bucket: 'sjg-bucket-com', 
                                Key: 'static/articleimgs/' + filename, 
                                Body: createReadStream()
                            }
                            s3.upload(uploadParam)
                                .on("httpUploadProgress", evt => {

                                })
                                .send((err: any, data: any) => {
                                    if(err) {
                                        throw err;
                                    }
                                })
                            // createReadStream()
                            //     .pipe(createWriteStream(path.join(__dirname, '../../static/article', filename)))
                        })
                        .catch((err: any) => console.log(err))
                });
                const writer = await User.findById(context.parsingContext.clientInfo.userId);
                if(!writer) {
                    throw new Error('User not found!')
                }
                writer.created_articles.push(article._id);
                await writer.save();
                return createdArticle;
            } 
            catch (err) {
                throw err;
            }
        },
        // delete article
        deleteArticle: async (object: any, args: any, context: any) => {
            const articleId = args.articleId;
            let targetArticle;
            try {
                const result = await Article.findById(articleId).populate('article');
                await Article.deleteOne({ _id: articleId });
                // Remove article in database
                const writer = await User.findById(context.parsingContext.clientInfo.userId);
                if(!writer) {
                    throw new Error('User not found!')
                }
                const idx = await writer.created_articles.indexOf(articleId);
                await writer.created_articles.splice(idx, 1);
                await writer.save();
                // Remove article id at the writer's article create list 
                if(result !== null) {
                    targetArticle = {
                        ...result._doc,
                        _id: result._id,
                        title: result._doc.title,
                        description: result._doc.description,                    
                        date: new Date(result._doc.date).toISOString(),
                        writer: writer,
                    }
                    const images = result._doc.images;
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
                                })
                                // unlinkSync(path.join(__dirname, `../../static/article`, image))
                            } catch (error) {
                                throw error
                            }
                        })
                    }
                    // Image processing access to S3 system
                    return targetArticle;
                }
            } 
            catch (err) {
                throw err
            }
        },
        // update article
        updateArticle: async (object: any, args: any, context: any) => {
            const articleId = args.articleId;
            const userId = context.parsingContext.clientInfo.userId;
            const articleOwner = await Article.findById(articleId).populate('article');
            const articleImages = await args.articleInput.images;
            if(articleOwner !== null) {
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
                            })
                            // unlink(path.join(__dirname, '../../static/article', image))
                        })
                        // Delete all files in the article and save all files in storage
                        articleOwner._doc.images = [''];
                        // Is it necessary?
                        articleImages.map((image: any) => {
                            image
                                .then(({ filename, mimetype, encoding, createReadStream }: any) => {
                                    if(!articleOwner._doc.images.includes(filename)) { // it's better to use 'includes' method
                                        let uploadParam = {
                                            Bucket: 'sjg-bucket-com', 
                                            Key: 'static/articleimgs/' + filename, 
                                            Body: createReadStream()
                                        }
                                        s3.upload(uploadParam)
                                            .on("httpUploadProgress", evt => {
            
                                            })
                                            .send((err: any, data: any) => {
                                                if(err) {
                                                    throw err;
                                                }
                                            })
                                        // createReadStream()
                                        //     .pipe(createWriteStream(path.join(__dirname, '../../static/article', filename)))
                                    }
                                })
                                .catch((err: any) => console.log(err))
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
        }
    },
}