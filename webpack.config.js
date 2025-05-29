const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "bundle.[contenthash].js" : "[name].bundle.js",
    publicPath: "/",
    clean: true,
  },
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "source-map",

  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
      publicPath: "/",
    },
    historyApiFallback: true,
    hot: true,
    port: 3000,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[contenthash][ext][query]",
        },
      },
      {
        test: /\.json$/,
        use: 'json-loader',  // This might be unnecessary if you're using Webpack 5 or later
        type: 'javascript/auto'
      }
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: {
      chunks: "all",
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: isProduction
        ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
        }
        : false,
    }),
    ...(isProduction
      ? [
        new MiniCssExtractPlugin({
          filename: "styles.[contenthash].css",
        }),
      ]
      : []),
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
};
