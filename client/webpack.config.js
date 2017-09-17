var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './public');
var APP_DIR = path.resolve(__dirname, './src');

var config = {
	entry: ['babel-polyfill', `${APP_DIR}/index.js`],
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
	},
	devServer: {
		publicPath: "/",
		contentBase: "./public",
		hot: true
	},
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			}
		],
	}
};

module.exports = config;
