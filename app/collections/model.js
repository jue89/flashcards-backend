// Fire me up!

module.exports = {
	implements: 'model:collections',
	inject: [ 'mongo/objectid' ]
};

module.exports.factory = function( oid ) { return {
	idGenerator: oid,
	schema: {
		'_id': { mandatory: true, type: 'objectid' },
		'name': { mandatory: true, min: 1, type: 'string' },
		'authors': { foreign: 'users', multi: true, mandatory: 1 }
	},
	index: [ 'name' ]
}; }
