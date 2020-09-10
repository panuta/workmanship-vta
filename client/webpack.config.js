const path = require('path')

const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname);
const OUTPUT_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = (env = {}) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const entries = ['./client/src/index.js'];
  const plugins = [
    new Webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify((isDevelopment) ? 'development' : 'production') }),
    new HtmlWebpackPlugin({
      template: './client/public/index.html',
      showErrors: true
    })
  ];

  if (isDevelopment) {
    entries.unshift('webpack-hot-middleware/client?reload=true');
    plugins.unshift(new ReactRefreshWebpackPlugin());
    plugins.unshift(new Webpack.HotModuleReplacementPlugin());
  }

  return {
    entry: entries,
    mode: (isDevelopment) ? 'development' : 'production',
    output: {
      path: OUTPUT_PATH,
      filename: 'vta.bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: (isDevelopment) ? ['react-refresh/babel'] : []
          }
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          loader: 'file-loader?name=[name].[ext]'
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { url: false, sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
        }
      ]
    },
    plugins: plugins
  };
};
