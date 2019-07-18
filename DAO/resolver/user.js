const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../model/User');

module.exports = {
    Query: {

    },
    Mutation: {
        // create user method
        createUser: async (request, args) => {
            try {
                const existingUser = await User.findOne({email: args.userInput.email});
                if(existingUser) {
                    throw new Error('User exist already!')
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                let user = new User({
                    name: args.userInput.name,
                    email: args.userInput.email,
                    password: hashedPassword,
                    profile_image: args.userInput.profile_image,
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
    },
}