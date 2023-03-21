const path = require('path');
const Background = require(path.resolve(__dirname, 'plugins/background.js'));
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    publicPath: '../',
    outputDir: 'chromeExtensions',
    assetsDir: 'static',
    indexPath: 'popup/index.html',
    configureWebpack: {
        output: {
            filename: 'static/js/app.js',
            chunkFilename: 'static/js/chunk-vendors.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                path: '../static'
            }),
            new MiniCssExtractPlugin({
                filename: `static/css/app.css`,
                chunkFilename: `static/css/chunk-vendors.css`
            }),
            new Background(),
        ]
    }
};
