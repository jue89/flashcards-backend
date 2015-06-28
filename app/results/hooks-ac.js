// Fire me up!

module.exports = {
	implements: 'hook:results-ac',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) {

	// This will hide results of other users
	function restrictUser( query ) {

		// Get all boxes of current user
		return query.models.boxes.collection.fetch( {
			selector: { 'user': query.user },
			fields: [ '_id' ]
		} ).then( function( res ) {

			// Box selector
			var boxSelector = [];
			res.data.forEach( function( i ) {
				boxSelector.push( { 'box': i['_id'] } )
			} );

			// Modify query selector
			query.req.selector = { '$and': [
				query.req.selector,
				{ '$or': boxSelector }
			] };

			return query;

		} );

	}

	function checkInsertUser( query ) {

		// Fetch related collection
		return query.models.boxes.collection.fetch( {
			selector: { '_id': query.req.box }
		} ).then( function( res ) {

			// If no record has been found just ignore ... the request will fail
			if( res.count == 0 ) {
				return query;
			}

			// Make sure requesting user is in authors list
			if( ! query.user || res.data[0].user != query.user ) {
				return auth.reject();
			}

			return query;

		} );

	}

	return { results: {

		preInsert: {
			priority: 1,
			action: checkInsertUser
		},

		preUpdate: {
			priority: 1,
			action: restrictUser
		},

		preFetch: {
			priority: 1,
			action: restrictUser
		},

		preDrop: {
			priority: 1,
			action: restrictUser
		},

	} };

}
