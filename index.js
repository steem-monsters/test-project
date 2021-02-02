const config = require('./config');
const { Hive } = require('@splinterlands/hive-interface');

const hive = new Hive();
hive.stream({ 
	on_op: onOperation,
	save_state: () => null,
	load_state: () => null
});

function onOperation(op, block_num, block_id, previous, transaction_id, block_time) {
	// Filter out any operations not related to Splinterlands
	if(op[0] != 'custom_json' || !op[1].id.startsWith(config.operation_prefix))
		return;

	console.log(`Received operation: ${JSON.stringify(op)}`);
}