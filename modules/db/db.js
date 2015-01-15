// Fire me up!

module.exports = {
	implements: 'db',
	inject: [ 'require(bluebird)', 'require(knex)', 'config', 'db/schema:*' ],
}

module.exports.factory = function( Promise, Knex, config, schemas ) {

	function setupSchema( db, schema ) {
		// First check whether schema exists
		return db.schema.hasTable( schema.tableName )
			.then( function( exists ) {
				// Skip when schema exists
				if( exists ) return;

				// Create schema
				return db.schema.createTable( schema.tableName, schema.build );
			} )
	}

	function setupDB() {
		// Initiate database connection
		var db = Knex( config.db );

		// Create schemas
		creator = [];
		for( var s in schemas ) for( var t in schemas[s] ) {
			creator.push( setupSchema( db, schemas[s][t] ) );
		}

		// Wait for all schemas to be created then return db
		return Promise.all( creator ).return( db );
	}

	return setupDB();
}