/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'string',
      unique: true,
      required:true
    },
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      allowNull: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
    }
  }
};


