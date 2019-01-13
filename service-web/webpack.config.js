var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV;
var plugins = [];


//var libraryName = 'library';
//var outputFile = libraryName + '.js';

if (env === 'build') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}


var config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js",
    //library: libraryName,
    //libraryTarget: 'umd',
    //umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  /*
  resolve: {
    alias: { 
      app: path.resolve('./src')
    },
    extensions: ['.js']
  },*/
	plugins: plugins
};

module.exports = config;