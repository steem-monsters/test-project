var express = require('express');
var router = express.Router();

const config = require('../config');
const { Hive } = require('@splinterlands/hive-interface');
const { json } = require('express');

const hive = new Hive();

const blockOperations = new Map()
const blockUsers = new Map()
const blockUserOperations = new Map()

/*
* TODO: Could pause and resume with load/save, but probably worth statying
* in sync.
*/
hive.stream({
  on_op: onOperation,
  save_state: () => null,
  load_state: () => null
});

// TODO: Error checking/handling
function onOperation(op, block_num, block_id, previous, transaction_id, block_time) {

  // Filter out any operations not related to Splinterlands
  if (op[0] != 'custom_json' || !op[1].id.startsWith(config.operation_prefix))
    return;

  //TODO: Extrnalize data to a model.

  //Parse data out of op
  const opData = {
    opName: op[1].required_posting_auths[0],
    id: op[1].id,
    time: block_time,
    blockNum: block_num,
    tid: transaction_id
  }

  //Load data into "models"

  if (blockOperations.has(opData.id)) {
    count = blockOperations.get(opData.id)
    count++
    blockOperations.set(opData.id, count)
  } else {
    blockOperations.set(opData.id, 1)
  }

  //TODO: Undefined is getting into this model, figure out why
  if (blockUsers.has(opData.opName)) {
    count = blockUsers.get(opData.opName)
    count++
    blockUsers.set(opData.opName, count)
  } else {
    blockUsers.set(opData.opName, 1)
  }

  if (blockUserOperations.has(opData.opName)) {
    userOps = blockUserOperations.get(opData.opName)
    userOps.push(opData)
    blockUserOperations.set(opData.opName, userOps)
  } else {
    dat = new Array()
    dat.push(opData)
    blockUserOperations.set(opData.opName, dat)
  }

}

router.get('/', function (req, res, next) {
  res.render("index.html")
});

// TODO: Error checking/handling
router.get('/operations', function (req, res, next) {
  const obj = Object.fromEntries(blockOperations);
  res.json(JSON.stringify(obj))
});

// TODO: Error checking/handling
router.get('/players', function (req, res, next) {
  const obj = Object.fromEntries(blockUsers);
  res.json(JSON.stringify(obj))
});

// TODO: Error checking/handling, sanatize data
router.get('/playerStats/:userName', function (req, res, next) {

  const player = req.params.userName

  if (blockUserOperations.has(player)) {
    const userOperations = blockUserOperations.get(player)
    const data = {
      "operations": userOperations
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
