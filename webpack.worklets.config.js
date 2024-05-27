const path = require('path')
const glob = require('glob')

// Dynamically generate entry points
const entry = glob.sync('./src/worklets/**/*.ts').reduce((entries, file) => {
  const name = path.parse(file).name
  entries[name] = path.resolve(__dirname, file)
  return entries
}, {})

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'public/worklets'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.worklets.json',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
}
