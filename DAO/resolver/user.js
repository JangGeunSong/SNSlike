const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createWriteStream } = require('fs');
const path = require('path');

const User = require('../../model/User');
const Article = require('../../model/Article');

module.exports = {
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
        }
    },
    Mutation: {
        // create user method
        createUser: async (request, args) => {
            try {
                // Only File name is sended. That is problem for fail to fetch error. I need to solve this problem!.
                console.log(args.userInput.profile_image)
                const { createReadStream, filename, mimetype, encoding } = await args.userInput.profile_image;
                const existingUser = await User.findOne({email: args.userInput.email});
                if(existingUser) {
                    throw new Error('User exist already!')
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                await createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, `../../static/images`, filename)));
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
        login: async (request, args) => {
            const user = await User.findOne({ email: args.loginInput.email });
            try {
                const isExistUser = await User.findOne({ email: args.loginInput.email });
                if(!isExistUser) return new Error('User is not exist!');
                const isPasswordEqual = await bcrypt.compare(args.loginInput.password, user.password)
                if(!isPasswordEqual) return new Error('Password is not matched. please check your password!');
                const token = jwt.sign(
                    {userId: user.id, email: user.email},
                    'somesupersecurity',
                    {
                        expiresIn: '1h'
                    }
                );
                return { userId: user.id, userName: user.name, token: token, tokenExpiration: 1 };
            } 
            catch (error) {
                throw err;
            }
        }
    },
}