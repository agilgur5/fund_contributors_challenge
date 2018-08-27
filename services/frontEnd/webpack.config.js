const path = require('path')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const commonEntry = ['./config/polyfills.js']
const outputDir = 'build/'

// webpack's configuration
module.exports = {
  // setting NODE_ENV does _not_ automatically set mode
  mode: isProd ? 'production' : 'development',
  entry: {
    // don't include errorOverlay in production
    ...(isProd ? {} : {errorOverlay: 'webpack-serve-overlay'}),
    main: commonEntry.concat('./main.js')
  },
  output: {
    path: path.join(__dirname, outputDir), // where builds go
    // can only use hash in development
    filename: isProd
      ? '[name].bundle.[contenthash].js' : '[name].bundle.[hash].js'
  },
  resolve: {
    // resolve from package root as well, so utils/... , etc works
    modules: [__dirname, 'node_modules']
  },
  module: {
    rules: [
      // use ! to chain loaders; note that the first loader is rightmost (RtL)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { cacheDirectory: !isProd } // only cache in development
      },
      {
        test: /\.pcss$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.pcssm$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1!postcss-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.cssm$/,
        loader: 'style-loader!css-loader?modules'
      },
      // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      // fonts should normally be loaded by URL/CDN, but config if needed
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new HTMLPlugin({
      template: 'index.html.ejs'
    })
  ],
  optimization: {
    // split webpack's boilerplate code into separate chunk for better caching
    runtimeChunk: 'single',
    // split vendored code into separate chunk for same reasons
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}

const webpackServeWaitpage = require('webpack-serve-waitpage')
// webpack-serve configuration
module.exports.serve = {
  mode: 'development', // only use for development
  devMiddleware: {
    // MUST be set to not be routed to /
    // cannot use relative paths, so must use /build/
    // see https://github.com/webpack/webpack-dev-middleware/issues/269
    publicPath: '/' + outputDir
  },
  add: async (app, middleware, options) => {
    // must pass options arg from add args
    // show page on any hot full page reloads as well, not just first bundle
    app.use(webpackServeWaitpage(options, {disableWhenValid: false}))

    // should come after waitpage
    // must use await to avoid race conditions
    // see https://github.com/webpack-contrib/webpack-serve/issues/238
    await middleware.webpack()
    middleware.content()
  }
}
