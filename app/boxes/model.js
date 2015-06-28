// Fire me up!

module.exports = {
	implements: 'model:boxes',
	inject: [ 'mongo/objectid' ]
};

module.exports.factory = function( oid ) { return {
	idGenerator: oid,
	schema: {
		'_id': { mandatory: true, type: 'objectid' },
		'collection': { foreign: 'collections', multi: false, mandatory: true },
		'user': { foreign: 'users', multi: false, mandatory: true },
		'mode': { mandatory: false, type: 'object' }
	},
	index: [ 'user' ]
}; }
