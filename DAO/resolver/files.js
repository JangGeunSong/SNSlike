// const Article = require('../../model/Article');
const User = require('../../model/User');
const fs = require('fs');

// uploads: [File]
// singleUpload(file: Upload!): File!

module.exports = {
    Query: {
        uploads: async (parents, args) => {
            const files = await fs.readFileSync("../../static/image")
            return files;
        },
    },
    Mutation: {
        singleUpload: async (parents, args) => {
            console.log(args.file);
            return args.file.then(file => {
                await fs.writeFileSync("../../static/image", file);
                return file;
            });
        },
    },
}