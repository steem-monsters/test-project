var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
  res.render("index.html")
});

router.get('/operations', function (req, res, next) {
  res.json(JSON.stringify({
    "operations": [
      {
        "name": "op1",
        "count": "1"
      },
      {
        "name": "op2",
        "count": "42"
      }
    ],
  }))
});

router.get('/players', function (req, res, next) {
  randCount = Math.floor(Math.random() * 6) + 1

  res.json(JSON.stringify({
    "operations": [
      {
        "name": "Tim",
        "count": randCount.toString()
      },
      {
        "name": "Bob",
        "count": "27"
      }
    ],
  }))
});


router.get('/playerStats/:param1', function (req, res, next) {
  player = req.params.param1
  //console.log(player)
  randCount = Math.floor(Math.random() * 6) + 1

  res.json(JSON.stringify({
    "operations": [
      {
        "name": "op1",
        "time": Date.now().toString(),
        "blocknum": randCount.toString(),
        "tid": "1",
      },
      {
        "name": "op2",
        "time": Date.now().toString(),
        "blocknum": randCount.toString(),
        "tid": "1",
      }
    ],
  }))
});

module.exports = router;
