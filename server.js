const express = require('express')
const auth = require('./routes/auth/login.js')
require('dotenv').config()

// instantiating an express server
const app = express();

// middlewares
app.use(express.json())

// routes
app.use('/auth', auth)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))