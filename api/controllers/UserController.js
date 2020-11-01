/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const {
    Path,
    GET,  
    Description, 
    POST, 
    PathParam, 
    QueryParam, 
    Response, 
    SwaggerConfig,
    Summary,
    util,
    Tag,
    SwaggerExclude
} = require('../../dist/index');

@Path('/users')
class UserController {

    @POST
    @Tag('user', 'member')
    async create (req, res) {}


    @GET
    @Path('/:id')
    @PathParam('id', {description: 'user\'s id'})
    @Summary('Return logged in user')
    @Response(util.responseModelSchema(200, 'user', ''))
    async getMe (req, res) {
    }


    @GET
    @Path('/:id/items')
    @Description('List all user items')
    @QueryParam('item', {description: 'the item to get'})
    @Tag('Item')
    async getUserItems (req, res) {
    }


    @POST
    @Path('/:id')
    @SwaggerConfig({
        summary: "update user details",
        responses: util.responseModelSchema(200, 'user', ''),
        requestBody: util.bodySchema({
            firstName: 'string',
            lastName: 'string'
        })
    })
    async updateMyDetails (req, res) {
    }
    

    @GET
    @Path('/:id/private')
    @SwaggerExclude
    async privateMethod(req, res){
    }

};

const userController = new UserController()

const {
    updateMyDetails,
    getUserItems,
    getMe,
    create,
    privateMethod
} = userController

module.exports = {
    updateMyDetails,
    getUserItems,
    getMe,
    create,
    privateMethod
}
