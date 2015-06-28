// Fire me up!

module.exports = {
	implements: 'auth',
	inject: [ 'require(bluebird)', 'require(crypto)', 'auth/error' ]
};

module.exports.factory = function( P, crypto, AuthError ) {

	return { gen: gen, check: check, require: require, reject: reject };

	// Salt given password
	function salt( password, salt ) {

		var hash = crypto.createHash('sha1');
		hash.update( password );
		hash.update( salt );
		hash = hash.digest();

		salt = new Buffer( salt );

		return Buffer.concat( [ hash, salt ] ).toString( 'base64' );

	}

	// Generate salted hash from password
	function gen( password ) {
		return new P( function( resolve, reject ) {

			crypto.randomBytes( 16, function( err, rnd ) {
				if( err ) return reject( err );
				return resolve( salt( password, rnd ) );
			} );

		} );
	}

	// Check given password against hash
	function check( password, ssha ) {

		// Decode SSHA1 hash
		ssha = new Buffer( ssha, 'base64' );

		// Get SHA1 hash
		var sha = ssha.slice( 0, 20 );

		// Get salt
		var salt = ssha.slice( 20 );

		// Hash given password with salt
		var hash = crypto.createHash('sha1');
		hash.update( password );
		hash.update( salt );
		hash = hash.digest();

		// Compare
		return hash.equals( sha ) ? P.resolve() : reject();

	}

	// Require auth
	function require() {

		return P.reject( new AuthError(
			'access-denied',
			"Username and password are required."
		) );

	}

	// Reject auth
	function reject() {

		return P.reject( new AuthError(
			'access-denied',
			"Wrong password or username."
		) );

	}
}
