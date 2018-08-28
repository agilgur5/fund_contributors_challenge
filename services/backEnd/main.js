const express = require('express')

const app = express()

// serve static assets from build similarly to webpack-serve config
app.use('/build', express.static('../frontEnd/build/'))

app.listen(8080, () => console.log('Listening on port 8080'))
