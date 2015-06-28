// Fire me up!

module.exports = {
	implements: 'hook:token',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) { return {

	global: {

		pre: {
			action: function( query ) {

				// Allow account creation without token
				if( query.model == 'users' && query.action == 'insert' ) return query;

				// Allow login without token
				if( query.model == 'auth' && query.action == 'insert' ) return query;


				var headers = query.httpReq.headers;

				// No x-token header given
				if( ! headers[ 'x-token' ] ) return auth.require();

				// Process authorisation
				var token = headers[ 'x-token' ];

				// Ask database for token
				return query.models.auth.collection.fetch( {
					'selector': { '_id': token },
				} ).then( function( res ) {

					// No results --> not found
					if( res.count == 0 ) return auth.reject();

					// Store user id in query object
					query.user = res.data[0].user;

					return query;

				} );

			}
		}

	}

}; }
