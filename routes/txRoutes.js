const express = require('express');
const router = express.Router();

const {
    getTx,
} = require('../controllers/txController');

router.get('/getTx', getTx);
router.get('/', getTx);


module.exports = router;
