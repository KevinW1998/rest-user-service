let express = require("express");
let database = require("./database");
let userDatabase = new database.UserDatabase();

// Express Settings
let app = express();
app.use(express.urlencoded({extended: true}));


// Static Webpage for testing
function registerClientFile(name) {
  app.get("/" + name, function (req, res) {
    res.sendFile(__dirname + "/client/" + name + ".html");
  });
}

registerClientFile("login");
registerClientFile("register");






// Login action
app.post("/login-request", function(req, res){
  let username = req.body.username;
  let password = req.body.password;

  userDatabase.checkUser(username, password, (statusCode) => {
    res.send(JSON.stringify({code: statusCode}));
  });

  console.log("Login request!")
});

// Register action
app.post("/register-request", function (req, res) {
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  userDatabase.registerUser(username, email, password, (statusCode) => {
    res.send(JSON.stringify({code: statusCode}));
  });

  console.log("Register request!")
});

app.listen(3000, function () {
  console.log("running");
});

// Sources: https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters



