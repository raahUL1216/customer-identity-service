const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    return res.send('Employee service is up.');
});

router.get('/health', function(req, res, next) {
    return res.json({status: true})
});

module.exports = router;