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
  let offset = 0 // undefined offset -> 0
  if ('offset' in req.query) {
    offset = parseInt(req.query.offset)
  }
  if (isNaN(offset) || offset < 0) {
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

app.delete('/api/contributors', (req, res) => {
  if (!('path' in req.query)) {
    return res.status(400).json({error: 'Invalid path'})
  }
  const path = req.query.path
  const index = contributors.findIndex((elem) => elem.path === path)
  if (index === -1) {
    return res.sendStatus(404)
  }
  contributors.splice(index, 1) // use splice to mutate the array
  fs.unlink(path, () => {})
  return res.sendStatus(204)
})

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
