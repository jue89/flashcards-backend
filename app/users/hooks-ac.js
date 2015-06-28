// Fire me up!

module.exports = {
	implements: 'hook:users-ac',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) {

	function checkId( query ) {

		// Users are not allowed to change / drop others accounts
		if( ! query.user || query.req.selector._id != query.user ) {
			return auth.reject();
		}

		return query;

	}

	return { users: {

		preUpdate: {
			priority: 1,
			action: checkId
		},

		preDrop: {
			priority: 1,
			action: checkId
		}

	} };

}
