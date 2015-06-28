// Fire me up!

module.exports = {
	implements: 'hook:flashcards-ac',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) {

	function checkUpdateAuthor( query ) {

		// Get current flashcard
		return query.models.flashcards.collection.fetch( {
			selector: { '_id': query.req.selector._id }
		} ).then( function( res ) {

			// If no record has been found just ignore ... the request will fail
			if( res.count == 0 ) {
				return query;
			}

			// Fetch related collection
			return query.models.collections.collection.fetch( {
				selector: { '_id': res.data[0].collection }
			} ).then( function( res ) {

				// Make sure requesting user is in authors list
				if( ! query.user || res.data[0].authors.indexOf( query.user ) == -1 ) {
					return auth.reject();
				}

				return query;

			} );

		} );

	}

	function checkInsertAuthor( query ) {

		// Fetch related collection
		return query.models.collections.collection.fetch( {
			selector: { '_id': query.req.collection }
		} ).then( function( res ) {

			// If no record has been found just ignore ... the request will fail
			if( res.count == 0 ) {
				return query;
			}

			// Make sure requesting user is in authors list
			if( ! query.user || res.data[0].authors.indexOf( query.user ) == -1 ) {
				return auth.reject();
			}

			return query;

		} );

	}

	return { flashcards: {

		preInsert: {
			priority: 1,
			action: checkInsertAuthor
		},

		preUpdate: {
			priority: 1,
			action: checkUpdateAuthor
		},

		preDrop: {
			priority: 1,
			action: checkUpdateAuthor
		}

	} };

}
