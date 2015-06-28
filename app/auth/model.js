// Fire me up!

module.exports = {
	implements: 'model:auth',
	inject: [ 'mongo/objectid' ]
};

module.exports.factory = function( oid ) { return {
	schema: {
		'user': { foreign: 'users', multi: false, mandatory: true }
	},
	index: [ 'user' ],
	reject: [ 'fetch', 'update' ]
}; }
