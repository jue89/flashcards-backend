// Fire me up!

module.exports = {
	implements: 'hook:auth-ac',
	inject: [ 'auth' ]
};

module.exports.factory = function( auth ) {

	function checkId( query ) {

		// Users are not allowed to drop others tokens
		if( query.httpReq.headers['x-token'] != query.req.selector._id ) {
			return auth.reject();
		}

		return query;

	}

	return { auth: {

		preDrop: {
			priority: 1,
			action: checkId
		}

	} };

}
