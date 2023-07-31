const express = require("express");
const router = express.Router();

const getTx = (req, res) => {
  const txGen = () => ({
    address: Math.random() * 100_000 + "",
    amount: Math.random() * 100_100,
  });
  res.send(JSON.stringify(Array(10).fill(0).map(txGen)));
}

module.exports = { getTx };
