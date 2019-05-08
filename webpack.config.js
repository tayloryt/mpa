const HtmlWebpackPlugin = require('html-webpack-plugin');
const argv = require('yargs-parser')(process.argv.slice(2));
const merge = require('merge');
const _mode = argv.mode;
const _flag = (_mode == "production" ? true : false)
const _modeConfig = require(`./config/webpack.${_mode}.js`);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const htmlAfterPlugin = require('./config/htmlAfterPlugin.js');
const glob = require('glob');
let _entry = {};
let _plugins = []
const files = glob.sync("./src/webapp/views/**/*.entry.js");
console.log("环境是："+_mode)
console.log(files)
for (let item of files) {
  console.log(item)
  if (/.+\/([a-zA-Z]+-[a-zA-Z]+)(\.entry\.js$)/g.test(item) == true) {
    const entryKey = RegExp.$1;
    console.log("得到的key:", entryKey)
    _entry[entryKey] = item;
    const[dist,template] = entryKey.split('-');
    _plugins.push(
      new HtmlWebpackPlugin({
        filename: `../views/${dist}/pages/${template}.html`,
        template:`src/webapp/views/${dist}/pages/${template}.html`,
        chunks:["runtime","commons",entryKey],
        minify: {
          removeComments: _flag,
          collapseWhitespace: _flag
        },
        inject:false
      }),
    )
  }
}
const baseConfig = {
  entry: _entry,
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
        },
      }],
    }, ],
  },
  output:{
    path:path.join(__dirname,"./dist/assets"),
    publicPath:'/',
    filename:"scripts/[name].bundles.js"
  },
  optimization:{
    noEmitOnErrors:false,
    splitChunks:{
      cacheGroups:{
        commons:{
          chunks:'initial',
          name:'common',
          minChunks:2,
          maxInitialRequests:5,
          minSize:0
        }
      }
    },
    runtimeChunk:{
      name:"runtime"
    }
  },
  profile:true,
  plugins: [
    ..._plugins,
    new htmlAfterPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: _flag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      chunkFilename: _flag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'src/index.html',
    //   minify:{
    //     removeComments:_flag,
    //     collapseWhitespace:_flag
    //   }
    // }),
    new WebpackBuildNotifierPlugin({
      title: "执行完毕",
      logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    }),
    new ProgressBarPlugin(),
    // new CleanWebpackPlugin(["dist"])
  ].concat(_modeConfig.plugins)
}
module.exports = merge(_modeConfig, baseConfig)