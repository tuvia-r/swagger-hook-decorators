/* eslint-disable linebreak-style */
const babel = require('@babel/register')
require("regenerator-runtime/runtime")
require('@babel/plugin-proposal-decorators')
module.exports = babel({
  plugins: [[require('@babel/plugin-proposal-decorators').default, { legacy: true }]]
});
var sails = require('sails');
// Before running any tests...
before(function (done) {
  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout(60000);
  sails.lift(
    {
      // Your Sails app's configuration files will be loaded automatically,
      // but you can also specify any other special overrides here for testing purposes.

      // For example, we might want to skip the Grunt hook,
      // and disable all logs except errors and warnings:
      hooks: {
            // Skip grunt (unless your hook uses it)
            grunt: false,
            orm: false
        }
    },
    (err) => {
      if (err) {
        return done(err);
      }

      // here you can load fixtures, etc.
      // (for example, you might want to create some records in the database)

      return done();
    }
  );
});

// After all tests have finished...
after((done) => {
  // here you can clear fixtures, etc.
  // (e.g. you might want to destroy the records you created above)
  sails.lower(done);
});
