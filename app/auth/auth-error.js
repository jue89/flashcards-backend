/* jslint node: true */
'use strict';
// Fire me up!

module.exports = {
	implements: 'auth/error',
	inject: [ 'require(util)' ]
};

module.exports.factory = function( util ) {

	// Error object for all schema-related errors
	function AuthError( type, message ) {
		Error.call( this );
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
		this.message = message;
		this.type = type;
	}
	util.inherits( AuthError, Error );

	return AuthError;

};
