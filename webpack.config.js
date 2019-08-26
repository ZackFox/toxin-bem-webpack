const Webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");
const cssnano = require("cssnano");
const path = require("path");

const config = {
  entry: "./src/index.js",
  output: {
    filename: "js/bundle.js",
    path: path.join(__dirname, "/build"),
    publicPath: "/",
  },
  devServer: {
    overlay: true,
    stats: {
      chunks: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: "html-loader",
          },
          {
            loader: `pug-html-loader`,
            options: {
              pretty: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/env"],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                autoprefixer,
                mqpacker,
                cssnano({
                  preset: ["default", { discardComments: { removeAll: true } }],
                }),
              ],
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg|ico)$/i,
        exclude: [path.resolve(__dirname, "src/fonts")],
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: [
          path.resolve(__dirname, "src/img"),
          path.resolve(__dirname, "src/blocks"),
        ],
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "src/img/",
        to: "img/",
      },
    ]),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/pages/index.pug",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "ui-kit.html",
      template: "src/pages/ui-kit.pug",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "home.html",
      template: "src/pages/home.pug",
      inject: false,
    }),
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
    new Webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};

module.exports = config;
