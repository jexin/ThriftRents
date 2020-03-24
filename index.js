const express = require('express') // web framework for node.js
const cors = require('cors') // access outside server from server
require('dotenv').config() // load environment variables
const app = express(); // create server
const port = process.env.PORT || 5000; // server port
// middleware
app.use(cors()) 
app.use(express.json())

// routes
const listingsRouter = require('./routes/listings')
app.use('/listings', listingsRouter)

// connect to database
const mongoose = require('mongoose')
const uri = process.env.ATLAS_URI 
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
const connection = mongoose.connection
connection.once('open', () => {
  console.log("Database connected")
})

app.listen(port, () => console.log(`Listening on port ${port}`)) // check server is up and running