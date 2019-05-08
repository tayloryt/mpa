const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {join} = require('path')
module.exports = {
    output: {
        path:join(__dirname, "./dist/assets"),
        publicPath: '/',
        filename: "scripts/[name].[contenthash:5].bundles.js"
    },
    optimization: {
        minimizer: [
            //   new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true // set to true if you want JS source maps
            //   }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}