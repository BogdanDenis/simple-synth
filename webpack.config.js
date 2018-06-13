const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader'],
				}),
			},
		],
	},
	plugins: [
		new ExtractTextPlugin('style.css'),
	],
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
		},
	},
	devServer: {
		port: 3000,
		hot: true,
		historyApiFallback: true,
	},
};
