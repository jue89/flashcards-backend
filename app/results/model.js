// Fire me up!

module.exports = {
	implements: 'model:results',
	inject: [ 'mongo/objectid' ]
};

module.exports.factory = function( oid ) { return {
	idGenerator: oid,
	schema: {
		'_id': { mandatory: true, type: 'objectid' },
		'box': { foreign: 'boxes', multi: false, mandatory: true },
		'flashcard': { foreign: 'flashcards', multi: false, mandatory: true },
		'section': { mandatory: true, type: 'number' }
	},
	index: [
		[ [ 'box', 'section' ] ],
		[ [ 'box', 'flashcard' ], { unique: true } ]
	]
}; }
