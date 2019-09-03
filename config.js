'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/chirp_db';
exports.PORT = process.env.PORT || 8000;
