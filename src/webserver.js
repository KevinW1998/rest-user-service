let express = require("express");
let database = require("./database");
let path = require("path");

class WebServer {
  constructor() {
    this._userDatabase = undefined;
    this._server = undefined;

    this._app = express();
    this._app.use(express.urlencoded({extended: true}));
    this._app.use(express.json());

  }

  registerClientFile(name) {
    this._app.get("/" + name, function (req, res) {
      res.sendFile(path.normalize(__dirname + "/../client/" + name + ".html"));
    });
  }

  init() {
    this._userDatabase = new database.UserDatabase();

    this.registerClientFile("login");
    this.registerClientFile("register");

    // Login action
    this._app.post("/login-request", (req, res) => {
      let username = req.body.username;
      let password = req.body.password;
      let responseType = req.body.responseType;

      let isJsonResponse = typeof responseType === 'string' && responseType === 'json';

      this._userDatabase.checkUser(username, password, (statusCode) => {
        if(isJsonResponse) {
          res.send(JSON.stringify({code: statusCode}));
        } else {
          if(statusCode === database.LoginStatusCode.USER_OK) {
            res.send(`<h1>Willkommen ${req.body.username}</h1>`);
          } else if(statusCode === database.LoginStatusCode.USER_INVALID_PASSWORD) {
            res.send("<h1>Falsches Passwort</h1><br><button onclick='window.history.back()'>&lt;&lt; Zurück</button>")
          } else if(statusCode === database.LoginStatusCode.USER_NOT_EXIST) {
            res.send(`<h1>Benutzer ${req.body.username} existiert nicht!</h1><br><button onclick='window.history.back()'>&lt;&lt; Zurück</button>`)
          }
        }
      });

      console.log("Login request!")
    });

    // Register action
    this._app.post("/register-request", (req, res) => {
      let email = req.body.email;
      let username = req.body.username;
      let password = req.body.password;
      let responseType = req.body.responseType;
      console.log(req.body);

      let isJsonResponse = typeof responseType === 'string' && responseType === 'json';

      this._userDatabase.registerUser(username, email, password, (statusCode) => {
        // console.log('I was called!');
        if(isJsonResponse) {
          res.send(JSON.stringify({code: statusCode}));
        } else {
          if(statusCode === database.RegStatusCode.USER_OK) {
            res.send(`<h1>Erfolgreich Benutzer ${req.body.username} registriert</h1>`);
          } else if(statusCode === database.RegStatusCode.USER_ALREADY_EXIST) {
            res.send(`<h1>Benutzer ${req.body.username} existiert schon!</h1><br><button onclick='window.history.back()'>&lt;&lt; Zurück</button>`)
          } else if(statusCode === database.RegStatusCode.USER_INSERT_FAILED) {
            res.send(`<h1>Interner Fehler bei der Regstrierung des Benutzer ${req.body.username}!</h1><br><button onclick='window.history.back()'>&lt;&lt; Zurück</button>`)
          }
        }
      });

      console.log("Register request!")
    });
  }

  run() {
    this._server = this._app.listen(3000, function () {
      console.log("== Running server on port 3000 ==");
    });
  }

  stop() {
    if(this._server) {
      this._server.close();
    }
  }
}

module.exports = {
  WebServer: WebServer
};

// Sources: https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters



