let webServerPackage = require('./src/webserver');
let webServer = new webServerPackage.WebServer();
webServer.init();
webServer.run();



