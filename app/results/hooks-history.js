// Fire me up!

module.exports = {
	implements: 'hook:results-history',
	inject: [ ]
};

module.exports.factory = function( ) {

	function addHistory( query ) {

		// Get the current object
		return query.models.results.collection.fetch( {
			selector: query.req.selector,
			fields: [ 'created_at', 'updated_at', 'section' ]
		} ).then( function( res ) {

			// If more than 1 or no docs are affected, just skip
			if( res.count != 1 ) return query;

			query.req.modifier.$push = { history: {
				date: res.data[0].updated_at || res.data[0].created_at,
				section: res.data[0].section
			} };

			return query;

		} );

	}


	return { results: {

		preUpdate: {
			priority: 0,
			action: addHistory
		}

	} };

}
