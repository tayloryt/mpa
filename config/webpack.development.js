const CopyPlugin = require('copy-webpack-plugin');
const {
    join
} = require('path');
module.exports = {
    output: {
        filename: "scripts/[name].bundles.js"
    },
    plugins: [
        new CopyPlugin([{
                from: join(__dirname,"../"+"/src/webapp/views/common/layout.html"),
                to: '../views/common/layout.html'
            }]),
        new CopyPlugin([{
            from: join(__dirname,"../"+"/src/webapp/components"),
            to: '../components'
        }],{
        copyUnmodified:true,
        ignore:["*.js","*.css",".DS_Store"]
    }),
    ]
}