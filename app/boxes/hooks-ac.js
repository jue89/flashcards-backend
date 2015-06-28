// Fire me up!

module.exports = {
	implements: 'hook:boxes-ac',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) {

	// This will hide boxes of other users
	function restrictUser( query ) {

		// Modify query selector
		query.req.selector = { '$and': [
			query.req.selector,
			{ 'user': query.user }
		] };

		return query;

	}

	// This will affect boxes that might be shown by the include field
	function removeForeignBoxes( q ) {

		var items = q.items;

		// Iterate through all items
		for( var i = items.length - 1; i >= 0; i-- ) {

			// If querying  user is not the owner remove it
			if( items[ i ].user != q.query.user ) {
				items.splice( i, 1 );
			}

		}

		return q;

	}

	function checkInsertUser( query ) {

		if( query.req.user != query.user ) {
			return auth.reject();
		}

		return query;

	}


	return { boxes: {

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

		itemFilter: {
			priotrity: 1,
			action: removeForeignBoxes
		}

	} };

}
