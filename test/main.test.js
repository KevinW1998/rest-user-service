let rp = require('request-promise-native');
let webServerPackage = require('./../src/webserver');
let database = require('./../src/database');
let uuid = require('uuid');


// Definitions for globals
let cleanUpFunctions = [];

// Cleanup - This are free floating functions, which are executed if a test runs or fails
afterEach(() => {
  for (let func of cleanUpFunctions) {
    func();
  }
  cleanUpFunctions = [];
});

test('registration and login', async () => {
  let webServer = new webServerPackage.WebServer();
  cleanUpFunctions.push(() => webServer.stop());
  webServer.init();
  webServer.run();

  let username = 'sample-user_' + uuid.v4();
  let password = '123456';
  let email = 'user@example.com';

  let resultSuccessful = await rp({
    method: 'POST',
    uri: 'http://localhost:3000/register-request',
    body: {
      username: username,
      password: password,
      email: email,
      responseType: 'json'
    },
    json: true
  });

  // Registration should be successful
  expect(resultSuccessful.code).toBe(database.RegStatusCode.USER_OK);


  let resultFailed = await rp({
    method: 'POST',
    uri: 'http://localhost:3000/register-request',
    body: {
      username: username,
      password: password,
      email: email,
      responseType: 'json'
    },
    json: true
  });

  // Registration should fail, as we already have a user with that name
  expect(resultFailed.code).toBe(database.RegStatusCode.USER_ALREADY_EXIST);

  // Now test login with invalid password
  let resultLoginWithInvalidPW = await rp({
    method: 'POST',
    uri: 'http://localhost:3000/login-request',
    body: {
      username: username,
      password: uuid.v4(),
      responseType: 'json'
    },
    json: true
  });

  expect(resultLoginWithInvalidPW.code).toBe(database.LoginStatusCode.USER_INVALID_PASSWORD);

  // Now test login with correct password
  let resultLogin = await rp({
    method: 'POST',
    uri: 'http://localhost:3000/login-request',
    body: {
      username: username,
      password: password,
      responseType: 'json'
    },
    json: true
  });

  expect(resultLogin.code).toBe(database.LoginStatusCode.USER_OK);
});

test('login with non-existing user', async() => {
  let webServer = new webServerPackage.WebServer();
  cleanUpFunctions.push(() => webServer.stop());
  webServer.init();
  webServer.run();

  // Now test login with invalid password
  let resultLoginWithInvalidUser = await rp({
    method: 'POST',
    uri: 'http://localhost:3000/login-request',
    body: {
      username: 'invalid-user',
      password: uuid.v4(),
      responseType: 'json'
    },
    json: true
  });

  expect(resultLoginWithInvalidUser.code).toBe(database.LoginStatusCode.USER_NOT_EXIST);
});


