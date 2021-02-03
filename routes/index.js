var express = require('express');
var router = express.Router();

const config = require('../config');
const { Hive } = require('@splinterlands/hive-interface');
const { json } = require('express');

const hive = new Hive();

ops = new Map()
users = new Map()

hive.stream({
  on_op: onOperation,
  save_state: () => null,
  load_state: () => null
});

function onOperation(op, block_num, block_id, previous, transaction_id, block_time) {
  // Filter out any operations not related to Splinterlands
  if (op[0] != 'custom_json' || !op[1].id.startsWith(config.operation_prefix))
    return;

  //console.log(`Received operation: ${JSON.stringify(op.app)}`);
  //console.log(`Received operation: ${JSON.stringify(op)}`);
  //console.log('Got an op')
  var data = {
    name: JSON.stringify(op[1].required_posting_auths[0]),
    id: op[1].id,
  }

  //console.log(`Received operation: ${JSON.stringify(op)}`);

  // if (!data.name.includes("bot")) {
  //   return
  // }

  //if (data.name !== 'RECRUIT_18005')
  //  return;

  if (ops.has(data.id)) {
    count = ops.get(data.id)
    count++
    ops.set(data.id, count)
  } else {
    ops.set(data.id, 1)
  }

  if (users.has(data.name)) {
    count = users.get(data.name)
    count++
    users.set(data.name, count)
  } else {
    users.set(data.name, 1)
  }

}

router.get('/', function (req, res, next) {
  res.render("index.html")
});

router.get('/operations', function (req, res, next) {
  const obj = Object.fromEntries(ops);
  res.json(JSON.stringify(obj))
});

router.get('/players', function (req, res, next) {

  const obj = Object.fromEntries(users);
  res.json(JSON.stringify(obj))

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
