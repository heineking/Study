const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));

const port = 3002;

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views/malicious.html'));
});

app.listen(port, () => console.log("app is listening at 3002"));
