const express = require("express");
const router = express.Router();
const cors = require('cors');
const {getTest} = require('../controllers/authControllers')

router.get('/test' ,getTest)


module.exports = router;