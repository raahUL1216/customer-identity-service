const express = require('express');
const router = express.Router();

router.post('/employee', async function (req, res, next) {
    res.send({})
});

module.exports = router;