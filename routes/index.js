var express = require('express');
var router = express.Router();

const config = require('../config');
const { Hive } = require('@splinterlands/hive-interface');
const { json } = require('express');

const hive = new Hive();

var ops = new Map()
var users = new Map()
var userOperations = new Map()

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
    name: op[1].required_posting_auths[0],
    id: op[1].id,
  }

  var opData = {
    id: op[1].id,
    time: block_time,
    blockNum: block_num,
    tid: transaction_id
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

  if (userOperations.has(data.name)) {
    userOps = userOperations.get(data.name)
    userOps.push(opData)
    userOperations.set(data.name, userOps)
  } else {
    dat = new Array()
    dat.push(opData)
    userOperations.set(data.name, dat)
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

  if (userOperations.has(player)) {
    uops = userOperations.get(player)
    const obj = JSON.stringify(uops);
    data = {
      "operations": uops
    }
    res.json(JSON.stringify(data))
  } else {
    data = {
      "operations": ""
    }
    res.json(JSON.stringify(data))
  }
});

module.exports = router;
