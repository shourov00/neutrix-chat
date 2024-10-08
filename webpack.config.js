const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')

module.exports = (_, argv) => {
  const isDevelopment = argv.mode === 'development'
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'neutrix.js',
      assetModuleFilename: '[name][ext]',
    },
    devServer: {
      open: true,
      host: 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      isDevelopment
        ? new Dotenv({ path: './.env', safe: true })
        : new webpack.DefinePlugin({
            'process.env.ENVIRONMENT': JSON.stringify(process.env.ENVIRONMENT),
            'process.env.REACT_APP_SERVER_API_ENDPOINT': JSON.stringify(
              process.env.REACT_APP_SERVER_API_ENDPOINT,
            ),
            'process.env.REACT_APP_CHAT_WEBSOCKET_API_ENDPOINT': JSON.stringify(
              process.env.REACT_APP_CHAT_WEBSOCKET_API_ENDPOINT,
            ),
          }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: 'asset',
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json',
        }),
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  }
}
