// Fire me up!

module.exports = {
	implements: 'hook:login',
	inject: [ 'require(bluebird)', 'require(crypto)', 'auth', 'secret' ]
};

module.exports.factory = function( P, crypto, auth, secret ) { return {

	auth: {

		preInsert: {
			action: function( query ) {

				var headers = query.httpReq.headers;

				// No auth header given
				if( ! headers.authorization ) return auth.requireCred();

				// Process authorisation
				var authHeader = headers.authorization.split(' ');
				if( authHeader[ 0 ] != "Basic" ) return auth.requireCred();
				var cred = new Buffer( authHeader[ 1 ], 'base64' ).toString();
				var index = cred.indexOf( ':' );
				var user = cred.slice( 0, index );
				var password = cred.slice( index + 1 );

				// Compare user name in body with the one given in header
				if( user != query.req.user ) return auth.rejectCred();

				// Ask database for user
				return query.models.users.collection.fetch( {
					'selector': { '_id': user },
				} ).then( function( res ) {

					// No results --> not found
					if( res.count == 0 ) return auth.rejectCred();

					// Check password against secret
					return secret.check( password, res.data[0].secret );

				} ).then( function() {

					// Create token
					return new P( function( resolve, reject ) {

						crypto.randomBytes( 16, function( err, rnd ) {
							if( err ) return reject( err );

							// Add token to request
							query.req['_id'] = rnd.toString( 'hex' );

							return resolve( query );
						} );

					} );

				} );

			}
		}

	}

}; }
