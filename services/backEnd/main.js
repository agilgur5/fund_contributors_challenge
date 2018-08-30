const express = require('express')

const pageSize = 6
const contributors = []
const app = express()

app.get('/api/contributors', (req, res) => {
  const offset = req.query.offset || 0
  if (offset > contributors.length || offset < 0) {
    return res.status(400).json({error: 'Invalid offset'})
  }
  return res.json({contributors: contributors.slice(offset, offset + pageSize)})
})

// serve static assets from build similarly to webpack-serve config
app.use('/build', express.static('../frontEnd/build/'))

// only start the server if run directly from Node, not if required by tests
/* istanbul ignore if */
if (require.main === module) {
  app.listen(8080, () => console.log('Listening on port 8080'))
}

// exclusively for testing purposes
module.exports = {
  app,
  pageSize,
  contributors
}
