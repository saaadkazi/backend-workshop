const express = require("express");
const { getHelloWorld } = require("../controller/helloController");

const router = express.Router();

router.get("/hello", getHelloWorld);

module.exports = router;