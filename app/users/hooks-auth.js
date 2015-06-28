// Fire me up!

module.exports = {
	implements: 'hook:auth',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) { return {

	global: {

		pre: {
			action: function( query ) {

				// Allow account creation without credentials
				if( query.model == 'users' && query.action == 'insert' ) return query;


				var headers = query.httpReq.headers;

				// No auth header given
				if( ! headers.authorization ) return auth.require();

				// Process authorisation
				var authHeader = headers.authorization.split(' ');
				if( authHeader[ 0 ] != "Basic" ) return auth.require();
				var cred = new Buffer( authHeader[ 1 ], 'base64' ).toString();
				var index = cred.indexOf( ':' );
				var user = cred.slice( 0, index );
				var password = cred.slice( index + 1 );

				// Ask database for user
				return query.models.users.collection.fetch( {
					'selector': { '_id': user },
				} ).then( function( res ) {

					// No results --> not found
					if( res.count == 0 ) return auth.reject();

					// Check password against secret
					return auth.check( password, res.data[0].secret );

				} ).then( function() {

					// Store user id in query object
					query.user = user;

					return query;

				} );

			}
		}

	}

}; }
