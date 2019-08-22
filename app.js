const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const session =require ('express-session')
const configRoutes = require("./routes");
const static = express.static(__dirname + '/public');

app.use('/public', static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	name: 'AuthCookie',
	secret: 'shhh..Its a secret',
	resave: false,
	saveUninitialized: true
}));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});