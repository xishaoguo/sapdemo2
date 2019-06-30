const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const argv = require('yargs-parser')(process.argv.slice(2))
const _mode = argv.mode || "development";
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _prodMode = (_mode == "production" ? true:false);
const merge = require('webpack-merge');

let webpackConfig  = {
    module:{
        rules: [
            {
              test: /\.css$/,
              use: [{
                loader: MiniCssExtractPlugin.loader
              }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[path][name]__[local]--[hash:base64:5]'
                }
              } ]
            }
        ]
    },
    devServer: {
        before(app) {
            app.get("/api/test", (req, res) => {
                res.json({
                    code: 200,
                    message: "Hello World"
                });
            });
        }
    },
    plugins: [
      new HtmlWebpackPlugin({  // Also generate a test.html
        filename: 'index.html',//默认生成的路径，生成到dist里
        template: 'src/index.html',//页面路径
        minify:{
            removeComments:_prodMode,
            collapseWhitespace:_prodMode
        }
    }),
    new MiniCssExtractPlugin({
        filename: _prodMode ? "styles/[name].[contenthash:5].css":"styles/[name].css",
        chunkFilename: _prodMode ? "styles/[id].[contenthash:5].css":"styles/[id].css"
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
            preset: ['default', {
                discardComments: {
                    removeAll: true
                }
            }],
        },
        canPrint: true
    }),
    new ProgressBarPlugin(),
    new CleanWebpackPlugin()
  ]
}

module.exports = merge(_mergeConfig,webpackConfig );