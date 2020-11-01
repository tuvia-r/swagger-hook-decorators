# swagger-hook-decorators

add decorators for generated swagger file, and to bind paths, for a sails app.

# usage

for auto generated swagger file, install `sails-hook-swagger-generator`.
for use of `@Path` and `@GET`, `@POST`,...etc., you need to import `routes` in your config/routes.js, and add it to the `module.exports.routes` like:
`const { routes } = require('../dist/index');`
`module.exports.routes = {...routes()}`

thats it!
