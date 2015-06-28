// Fire me up!

module.exports = {
	implements: 'model:users',
	inject: [ 'mongo/objectid' ]
};

module.exports.factory = function( oid ) { return {
	schema: {
		'_id': { mandatory: true, min: 3, type: 'string' },
		'secret': { mandatory: true, min: 8, type: 'string' }
	}
}; }
