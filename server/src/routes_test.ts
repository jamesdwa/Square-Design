import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { dummy, load, save, names, reset } from './routes';


describe('routes', function() {

  // After you know what to do, feel free to delete this Dummy test
  it('dummy', function() {
    // You can copy this test structure to start your own tests, these comments
    // are included as a reminder of how testing routes works:

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/dummy', query: {name: 'Zach'}}); 
    const res1 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    dummy(req1, res1);
    // check that the request was successful
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepStrictEqual(res1._getData(), {greeting: 'Hi, Zach'});
  });


  // TODO: add tests for your routes
  it('save', function() {
    let req = httpMocks.createRequest({method: 'POST', url: '/api/save', body: {name: 'Zach', content: 'Hello'}});
    let res = httpMocks.createResponse();
    save(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {saved: true});
  
    req = httpMocks.createRequest({method: 'POST', url: '/api/save', body: {content: 'Hello'}});
    res = httpMocks.createResponse();
    save(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), {error: 'Missing body'});
  
    req = httpMocks.createRequest({method: 'POST', url: '/api/save', body: {name: 'Zach'}});
    res = httpMocks.createResponse();
    save(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), {error: 'Missing body'});
  });
  
  it('load', function() {
    let req = httpMocks.createRequest({method: 'GET', url: '/api/load', query: {name: 'Zach'}});
    let res = httpMocks.createResponse();
    load(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {name: 'Zach', content: 'Hello'});
    
    req = httpMocks.createRequest({method: 'GET', url: '/api/load'});
    res = httpMocks.createResponse();
    load(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), {error: 'Missing body'});
    
    req = httpMocks.createRequest({method: 'GET', url: '/api/load', query: {name: 'NonExisting'}});
    res = httpMocks.createResponse();
    load(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 404);
    assert.deepStrictEqual(res._getData(), {error: 'Name not found'});
  });

  it('names', function() {
    const req1 = httpMocks.createRequest({method: 'GET', url: '/api/names'});
    const res1 = httpMocks.createResponse();
    names(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {names: ['Zach']});
  });

  it('reset', function() {
    reset();
    const req1 = httpMocks.createRequest({method: 'GET', url: '/api/names'});
    const res1 = httpMocks.createResponse();
    names(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {names: []});
  });
});
