module.exports = {
  plugins: [
    require('rucksack-css'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: { flexbox: 'no-2009' }
    })
  ]
}
