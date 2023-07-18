const express = require('express')
const router  = express.Router()

router.use(express.json())

router.get('/yo', async(req, res) => {
    res.send("HEHE BOI")
})

module.exports = router