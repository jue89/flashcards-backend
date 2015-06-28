/* jslint node: true */
'use strict';
// Fire me up!

module.exports = {
	implements: 'app/errhandlers:auth',
	inject: [ 'auth/error' ],
};

module.exports.factory = function( AuthError ) { return {
	register: function( app ) {

		// Authorisation error
		app.use( function( err, req, res, next ) {

			if( ! (err instanceof AuthError) ) return next( err );

			/*res.setHeader(
				'WWW-Authenticate',
				'Basic realm="Authorisation Required"'
			);*/
			res.endJSONapiError( 401, err.type, err.message );

		} );

	}
}; };
