// Fire me up!

module.exports = {
	implements: 'hook:users-secret',
	inject: [ 'secret' ]
};

module.exports.factory = function( secret ) { return {

	users: {

		preInsert: {
			action: function( query ) {

				// If password is given, hash it
				if( query.req.secret ) {
					return secret.gen( query.req.secret ).then( function( ssh1 ) {
						query.req.secret = ssh1;
					} ).return( query );
				} else {
					return query;
				}

			}
		},

		preUpdate: {
			action: function( query ) {

				// If new password is given, hash it
				if( query.req.modifier['$set'].secret ) {
					return secret.gen( query.req.modifier['$set'].secret ).then( function( ssh1 ) {
						query.req.modifier['$set'].secret = ssh1;
					} ).return( query );
				} else {
					return query;
				}

			}
		},

		itemFilter: {
			action: function( query ) {

				// Remove secret field form all items
				// It should never be sent to the user
				query.items.forEach( function( i ) {
					delete i.secret;
				} );

				return query;
			}
		},

		postUpdate: {
			action: function( query ) {

				// Hide secret from updated document
				delete query.res.secret;

				return query;

			}
		},

		postInsert: {
			action: function( query ) {

				// Hide secret from inserted document
				delete query.res.secret;

				return query;

			}
		}

	}

}; }
