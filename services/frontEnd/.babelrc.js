module.exports = {
  'presets': [
    ['@babel/preset-env', { useBuiltIns: 'usage' }],
    '@babel/preset-react',
    ['@babel/preset-stage-1', { decoratorsLegacy: true }]
  ],
  'plugins': [
    ['transform-imports', {
      'react-bootstrap': {
        'transform': 'react-bootstrap/lib/${member}',
        'preventFullImport': true
      }
    }]
  ]
}
