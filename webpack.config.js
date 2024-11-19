const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const Dotenv = require("dotenv");
const webpack = require("webpack");

Dotenv.config();

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    new webpack.DefinePlugin({
      "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(
        process.env.SUPABASE_ANON_KEY
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};
