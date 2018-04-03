

let couchbase = require('couchbase');

const RegStatusCode = {
  USER_OK: 0,
  USER_ALREADY_EXIST: 1,
  USER_INSERT_FAILED: 2
};

const LoginStatusCode = {
  USER_OK: 0,
  USER_NOT_EXIST: 1,
  USER_INVALID_PASSWORD: 2
};


class UserDatabase {
  constructor() {
    this.cluster = new couchbase.Cluster('localhost');
    this.cluster.authenticate('Administrator', '123465')
    this.bucket = this.cluster.openBucket('default', '', err => {
      if(err) {
        console.log(`Error while connecting to the cluster: ${err}`)
      }
    });
  }

  findUser(username, callback) {
    this.bucket.get(`user:${username}`, callback);
  }

  checkUserAvailable(username, callback) {
    this.findUser(username, (err, result) => {
      if(err) {
        console.log(`checkUserAvailable - Error: ${err.message}, Code: ${err.statusCode}`);
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  registerUser(username, email, password, callback) {
    this.checkUserAvailable(username, (isAvailable) => {
      if(!isAvailable) {

        // Register user
        this.bucket.upsert(`user:${username}`, {
          email: email,
          password: password
        }, function (err, result) {
          if(err) {
            console.log(`Error while inserting user: ${err.message}`);
            callback(RegStatusCode.USER_INSERT_FAILED);
          }
        });

        callback(RegStatusCode.USER_OK);
      } else {
        callback(RegStatusCode.USER_ALREADY_EXIST);
      }
    })

  }

  checkUser(username, password, callback) {
    this.findUser(username, (err, results) => {
      if(err) {
        callback(LoginStatusCode.USER_NOT_EXIST);
        return;
      }

      if(results.value.password !== password) {
        callback(LoginStatusCode.USER_INVALID_PASSWORD);
        return;
      }

      callback(LoginStatusCode.USER_OK);
    });
  }
}

module.exports = {
  UserDatabase: UserDatabase,
  RegStatusCode: RegStatusCode,
  LoginStatusCode: LoginStatusCode
};

