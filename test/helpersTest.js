const { assert } = require('chai');

const { getsIdByEmail, urlsForUser, generateRandomString } = require('../helpers.js');
const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getsUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getsIdByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });
  
  it('should return a undefined when email doesnt exist in database', function() {
    const user = getsIdByEmail("landon@hotmail.com ", testUsers)
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });
});

const testUrls = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" },
  isdfa: { longURL: "https://www.google.ca", userID: "user2RandomID" },
  fdsafasc: { longURL: "https://www.google.ca", userID: "sdfjl;sd" },
  a3rf3fv: { longURL: "https://www.google.ca", userID: "user2RandomID" },
  awef3: { longURL: "https://www.google.ca", userID: "uasdfalef" },
};

describe('urlsForUser', function() {
  it('should return a new database specifically talored with given users urls', function() {
    const user = urlsForUser("user2RandomID", testUrls)
    const expectedOutput = {
      i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }, 
      isdfa: { longURL: "https://www.google.ca", userID: "user2RandomID" }, 
      a3rf3fv: { longURL: "https://www.google.ca", userID: "user2RandomID" }
    };
    assert.deepEqual(user, expectedOutput);
  });
  
  it('should return an empty array when user has no urls to its name', function() {
    const user = urlsForUser("randomusername3000", testUrls)
    const expectedOutput = {}
    assert.deepEqual(user, expectedOutput);
  });

});

describe('urlsForUser', function() {
  it('should return a new database specifically talored with given users urls', function() {
    const user = urlsForUser("user2RandomID", testUrls)
    const expectedOutput = {
      i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }, 
      isdfa: { longURL: "https://www.google.ca", userID: "user2RandomID" }, 
      a3rf3fv: { longURL: "https://www.google.ca", userID: "user2RandomID" }
    };
    assert.deepEqual(user, expectedOutput);
  });
  
  it('should return an empty array when user has no urls to its name', function() {
    const user = urlsForUser("randomusername3000", testUrls)
    const expectedOutput = {}
    assert.deepEqual(user, expectedOutput);
  });

});