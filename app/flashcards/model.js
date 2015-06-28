// Fire me up!

module.exports = {
	implements: 'model:flashcards',
	inject: [ 'mongo/objectid' ]
};

module.exports.factory = function( oid ) { return {
	idGenerator: oid,
	schema: {
		'_id': { mandatory: true, type: 'objectid' },
		'question': { mandatory: true, min: 1, type: 'string' },
		'answer': { mandatory: true, min: 1, type: 'string' },
		'collection': { foreign: 'collections', multi: false, mandatory: true }
	},
	index: [ 'collection' ]
}; }
