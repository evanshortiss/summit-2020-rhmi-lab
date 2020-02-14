const path = require('path');
const webpack = require('webpack')
const env = require('env-var')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const BG_IMAGES_DIRNAME = 'bgimages';
const IS_PRODUCTION_BUILD = env.get('NODE_ENV').asString() === 'production'

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src', 'index.tsx')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      // Inject Google Maps API that's provided at build time
      // using an environment variable in the build settings
      MAPS_API_KEY: process.env.MAPS_API_KEY,
      // Inject the traffic and meters API URL
      API_URL: env.get('API_URL')
        .required(IS_PRODUCTION_BUILD)
        .example('https://traffic-api-evalsNN.apps.your-cluster.open.redhat.com')
        .asUrlString() || 'http://localhost:9000',

      // Inject the API Key for the API
      API_KEY: env.get('API_KEY')
        .required(IS_PRODUCTION_BUILD)
        .example('c0f6d493a1b5ba4b6fd6e6c09e90733e')
        .asString() || ''
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src/images/'),
        to: path.resolve(__dirname, 'dist/images/')
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            }
          }
        ]
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        // only process modules with this loader
        // if they live under a 'fonts' or 'pficon' directory
        include: [
          path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/pficon')
        ],
        use: {
          loader: 'file-loader',
          options: {
            // Limit at 50k. larger files emited into separate files
            limit: 5000,
            outputPath: 'fonts',
            name: '[name].[ext]',
          }
        }
      },
      {
        test: /\.svg$/,
        include: input => input.indexOf('background-filter.svg') > 1,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'svgs',
              name: '[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        // only process SVG modules with this loader if they live under a 'bgimages' directory
        // this is primarily useful when applying a CSS background using an SVG
        include: input => input.indexOf(BG_IMAGES_DIRNAME) > -1,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      },
      {
        test: /\.svg$/,
        // only process SVG modules with this loader when they don't live under a 'bgimages',
        // 'fonts', or 'pficon' directory, those are handled with other loaders
        include: input => (
          (input.indexOf(BG_IMAGES_DIRNAME) === -1) &&
          (input.indexOf('fonts') === -1) &&
          (input.indexOf('background-filter') === -1) &&
          (input.indexOf('pficon') === -1)
        ),
        use: {
          loader: 'raw-loader',
          options: {}
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        include: [
          path.resolve(__dirname, 'src'),
          // path.resolve(__dirname, 'src/images'),
          // path.resolve(__dirname, 'src/images/markerclusters'),
          path.resolve(__dirname, 'node_modules/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'images',
              name: '[name].[ext]',
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json')
      })
    ],
    symlinks: false,
    cacheWithContext: false
  },
};
