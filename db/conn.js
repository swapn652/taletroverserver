require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB)
.then(() => {
    console.log("Successfully Connected")
}).catch(() => {
    console.log("Failed to connect")
})

