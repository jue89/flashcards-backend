// Fire me up!

module.exports = {
	implements: 'hook:collections-ac',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) {

	function checkAuthor( query ) {

		// Get current collection
		return query.models.collections.collection.fetch( {
			selector: { '_id': query.req.selector._id }
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

	return { collections: {

		preUpdate: {
			priority: 1,
			action: checkAuthor
		},

		preDrop: {
			priority: 1,
			action: checkAuthor
		}

	} };

}
