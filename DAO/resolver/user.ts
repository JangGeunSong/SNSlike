import bcrypt from 'bcryptjs'
// const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken'
// const jwt = require('jsonwebtoken');

import { SECRET_KEY } from '../../staticConst'
// const { SECRET_KEY } = require('../../staticConst')
import User from '../../model/User'
// const User = require('../../model/User');

import s3 from '../../s3'
// const s3 = require('../../s3');

export default {
    Query: {
        users: async () => {
            try {
                const users = await User.find();
                return users.map(user => {
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        profile_image: user.profile_image,
                        profile: user.profile,
                        created_articles: user.created_articles,
                    };
                });
            } 
            catch (error) {
                throw error;
            }
        },
        user: async (object: any, args: any, context: any) => {
            const userId = context.parsingContext.clientInfo.userId;
            try {
                const targetUser = await User.findOne(userId);
                if(targetUser !== null) {
                    return {
                        _id: targetUser._id,
                        name: targetUser.name,
                        email: targetUser.email,
                        profile_image: targetUser.profile_image,
                        profile: targetUser.profile,
                        created_articles: targetUser.created_articles,
                    };    
                }
            } 
            catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        // create user method
        createUser: async (object: any, args: any) => {
            try {
                // Only File name is sended. That is problem for fail to fetch error. I need to solve this problem!.
                console.log(args.userInput.profile_image)
                const { createReadStream, filename, mimetype, encoding } = await args.userInput.profile_image;
                const existingUser = await User.findOne({email: args.userInput.email});
                if(existingUser) {
                    throw new Error('User exist already!')
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                let param = {
                    Bucket: 'sjg-bucket-com', 
                    Key: "static/profile/" + filename,
                    Body: await createReadStream()
                }
                // For S use S3 we need to set the parameter to send AWS system
                s3.upload(param)
                    .on("httpUploadProgress", evt => {

                    })
                    .send((err: any, data: any) => {
                        if(err) console.log(err)
                    })
                // S3 upload method

                // await createReadStream()
                //     .pipe(createWriteStream(path.join(__dirname, `../../static/images`, filename)));
                // Now image files are need to separate for usage. So I will replace name images -> profile
                let user = new User({
                    name: args.userInput.name,
                    email: args.userInput.email,
                    password: hashedPassword,
                    profile_image: filename,
                    profile: args.userInput.profile,
                    // To avoid password send to plain text must create hash value 
                });
                const result = await user.save();
                return { ...result._doc, password: null, _id: result.id }
            }
            catch (err) {
                throw err;
            }
        },

        // login method
        login: async (object: any, args: any, context: any, info: any) => {
            const user = await User.findOne({ email: args.loginInput.email });
            try {
                const isExistUser = await User.findOne({ email: args.loginInput.email });
                if(!isExistUser) return new Error('User is not exist!');
                
                let token = ''

                if(user !== null) {
                    const isPasswordEqual = await bcrypt.compare(args.loginInput.password, user.password)
                    if(!isPasswordEqual) return new Error('Password is not matched. please check your password!');
                    
                    token = jwt.sign(
                        {userId: user.id, email: user.email},
                        SECRET_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );
                    context.res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60
                    }); 
                    // Set cookie for the authentication.
                    // httpOnly option is more safe to illegally access from the client side JS or TS code directly.
                    return { userId: user.id, userName: user.name, token: token, tokenExpiration: 1 };
                }
            } 
            catch (error) {
                throw error;
            }
        },
        // delete User
        deleteUser: async (object: any, args: any, context: any) => {
            const userId = args.userId;
            let targetUser;
            try {
                const result = await User.findById(userId).populate('user');
                if(result !== null) {
                    await User.deleteOne({ _id: userId });
                    // Delete the file in server File storage
                    // unlink(__dirname, `../../static/images`, result._doc.profile_image)
                    let param = {
                        Bucket: 'sjg-bucket-com', 
                        Key: 'static/profile/' + result._doc.profile_image, 
                    }
                    s3.deleteObject(param, (err, data) => {
                        if(err) {
                            throw err;
                        }
                    })
                    targetUser = {
                        ...result._doc,
                        _id: result._id,
                        name: result._doc.name,
                        email: result._doc.email
                    }
                    return targetUser;
                }
            } 
            catch (error) {
                throw error;
            }
        },
        updateUser: async (object: any, args: any, context: any) => {
            const userId = args.userId;
            const { createReadStream, filename, mimetype, encoding } = await args.userInput.profile_image;
            const user = await User.findOne({ email: args.userInput.email });
            let updateContent;
            let newPassword = await bcrypt.hash(args.userInput.password, 12);
            try {
                if(user !== null) {
                    if(filename !== user.profile_image) { 
                        // If stored file name in database and new file name are diffent, delete stored file and save new file
                        // unlink(__dirname, "../../static/images", user.profile_image);
                        let deleteParam = {
                            Bucket: 'sjg-bucket-com', 
                            Key: 'static/profile/' + user._doc.profile_image, 
                        }
                        s3.deleteObject(deleteParam, (err, data) => {
                            if(err) {
                                throw err;
                            }
                        })
                        // Delete stored file
                        let uploadParam = {
                            Bucket: 'sjg-bucket-com', 
                            Key: 'static/profile/' + filename, 
                            Body: await createReadStream()
                        }
                        s3.upload(uploadParam)
                            .on("httpUploadProgress", evt => {
    
                            })
                            .send((err: any, data: any) => {
                                if(err) {
                                    throw err;
                                }
                            })
                        // await createReadStream()
                        //         .pipe(createWriteStream(path.join(__dirname, `../../static/images`, filename)));
                        // Create New profile picture
                    }
                }
                updateContent = {
                    name: args.userInput.name,
                    password: newPassword,
                    profile: args.userInput.profile,
                    profile_image: filename,
                }
                await User.findByIdAndUpdate(userId, updateContent, { new: true }, (error) => {
                    if(error) {
                        throw error;
                    }
                });
            } 
            catch (error) {
                throw error    
            }
        }
    },
}