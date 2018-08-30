const express = require('express')
const multer = require('multer')
const fs = require('fs')

const pageSize = 6
const contributors = []
const app = express()
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1 * 1024 * 1024 }
})

app.get('/api/contributors', (req, res) => {
  const offset = req.query.offset || 0
  if (offset > contributors.length || offset < 0) {
    return res.status(400).json({error: 'Invalid offset'})
  }
  return res.json({contributors: contributors.slice(offset, offset + pageSize)})
})

const photoUpload = upload.single('photo')
app.post('/api/contributors', (req, res) => photoUpload(req, res, (err) => {
  if (err || !req.file) {
    return res.status(400).json({error: 'Invalid photo'})
  }
  const path = req.file.path
  const name = req.body.name
  // normally would do validation before taking an upload, but multer is needed
  // to parse the multipart/form body
  if (!name) {
    // note that an empty preview will 500 multer
    fs.unlink(path, () => {}) // clean up the preview on error
    return res.status(400).json({error: 'Invalid name'})
  }
  contributors.push({name, path})
  return res.status(201).json({path})
}))

// serve static assets from build similarly to webpack-serve config
app.use('/build', express.static('../frontEnd/build/'))
app.use('/uploads', express.static('./uploads/'))

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
