/* eslint-disable linebreak-style */
const { expect } = require('chai');
describe('generate correct Swagger / OpenAPI 3 output (integration test)', () => {
  it('should generate expected JSON', done => {
    const generatedSwaggerFile = require('../../swagger/swagger.json')
    const testSwaggerFile = require('./swagger.json')
    expect(testSwaggerFile).to.deep.equal(generatedSwaggerFile);
    done();
  });
});

