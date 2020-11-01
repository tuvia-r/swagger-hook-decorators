
const swaggergenerator = require('sails-hook-swagger-generator')

module.exports = function myBasicHook(sails) {
    swaggergenerator(sails)
    return {};
 }