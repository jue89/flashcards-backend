// Fire me up!

module.exports = {
	implements: 'auth',
	inject: [ 'require(bluebird)', 'auth/error' ]
};

module.exports.factory = function( P, AuthError ) {

	return {
		require: require,
		reject: reject,
		requireCred: requireCred,
		rejectCred: rejectCred
	};

	// Require username / password
	function requireCred() {

		return P.reject( new AuthError(
			'access-denied',
			"Username and password are required."
		) );

	}

	// Reject username / password
	function rejectCred() {

		return P.reject( new AuthError(
			'access-denied',
			"Wrong password or username."
		) );

	}

	// Require token
	function require() {

		return P.reject( new AuthError(
			'access-denied',
			"Token is required."
		) );

	}

	// Reject token
	function reject() {

		return P.reject( new AuthError(
			'access-denied',
			"Wrong token."
		) );

	}
}
