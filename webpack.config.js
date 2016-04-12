var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.jsx',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devtool: 'sourcemap',
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      templateContent: '<html><head>' +
        '<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>' +
        '</head><body><div id="app"/></body></html>'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [{
      test: path.join(__dirname, 'src'),
      loader: 'babel-loader'
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  }
}
