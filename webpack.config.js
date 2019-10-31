const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.tsx',

	output: {
		filename: 'bundle.min.js',
		path: path.resolve(__dirname, 'dist')
	},

	plugins: [
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({
			title: 'Showcase',
			template: './public/index.ejs',
			inject: true
		})
	],

	module: {
		rules: [
			{
				test: /.(ts|tsx)?$/,
				loader: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules/
			},
			{ test: /\.ejs$/, loader: 'ejs-loader' }
		]
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			src: path.resolve(__dirname, 'src')
		}
	}
};
