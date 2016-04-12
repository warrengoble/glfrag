var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/app.jsx',
  resolve: {
    extensions: ['','.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devtool: 'sourcemap',
  plugins: [
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
    }]
  }
}
